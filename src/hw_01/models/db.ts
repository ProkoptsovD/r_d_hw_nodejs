import type { FileHandle } from 'node:fs/promises';
import fs from 'node:fs/promises';
import readline from 'node:readline';
import { doesFileExist } from '../../lib/fs.ts';

type DBEvents = 'read' | 'write' | 'update' | 'delete' | 'end';
type Listeners = Record<DBEvents, AnyFunction[]>;
type TransformFn<T> = (data: T) => NullOr<T>;

export class Database<T> {
	private fileDescriptor: NullOr<FileHandle> = null;
	private url: NullOr<string> = null;
	private listeners: Listeners = {} as Listeners;
	private isReadingCancelled = false;

	constructor(url: string) {
		this.url = url;
	}

	public async init() {
		if (!this.url) {
			return this._assertPathError();
		}

		const exists = await doesFileExist(this.url);

		if (exists) return this;

		await fs.appendFile(this.url, '[\n]', { encoding: 'utf-8' });
		return this;
	}

	private _assertPathError() {
		throw new Error('No file path was passed while initiate Database');
	}

	private _sanitizeJsonLine(line: string) {
		return line.trim().replace(/},?$/, '}');
	}
	private _parseJson(json: string) {
		try {
			return JSON.parse(json);
		} catch {
			throw new Error('JSON is mallformed');
		}
	}
	private _toJson(data: unknown) {
		return JSON.stringify(data);
	}

	private async _readFile() {
		if (!this.url) {
			return this._assertPathError();
		}

		this.fileDescriptor = await fs.open(this.url, 'r');

		const stream = this.fileDescriptor.createReadStream({ encoding: 'utf-8' });
		const lineReader = readline.createInterface({ input: stream, crlfDelay: Infinity });

		const endReading = () => {
			stream.close();
			lineReader.close();
			this.fileDescriptor?.close();
			this.fileDescriptor = null;
			this._emit('end', { error: null, data: null });
			this.isReadingCancelled = false;
		};

		lineReader.on('line', (line) => {
			if (this.isReadingCancelled) {
				return endReading();
			}
			if (line === '[') return;
			if (line === ']') {
				return endReading();
			}

			let error: NullOr<Error> = null;
			let data: Anything = null;

			try {
				const json = this._sanitizeJsonLine(line);
				data = this._parseJson(json);
			} catch (err) {
				error = err as Error;
			}

			this._emit('read', { error, data });
		});
	}
	private _createValidLine(data: string, delimiter?: string) {
		const res = '    ' + data + (delimiter ? ',' : '') + '\n';
		return res;
	}

	private async _writeFile(data: T) {
		if (!this.url) {
			return this._assertPathError();
		}

		const tempFileUrl = this.url + '.temp';
		this.fileDescriptor = await fs.open(this.url, 'r');
		const tempFile = await fs.open(tempFileUrl, 'w');

		const readStream = this.fileDescriptor.createReadStream({ encoding: 'utf-8' });
		const writeStream = tempFile.createWriteStream({ encoding: 'utf-8' });
		const lineReader = readline.createInterface({ input: readStream });

		lineReader.on('line', (line) => {
			const normalizedLine = line.trim();

			if (normalizedLine === ']') {
				writeStream.write(this._createValidLine(this._toJson(data)));
				writeStream.write(']\n', () => {
					writeStream.end();
				});
			} else {
				if (normalizedLine === '[') {
					return writeStream.write(normalizedLine + '\n');
				}

				const isOk = writeStream.write(this._createValidLine(this._sanitizeJsonLine(normalizedLine), ','));

				if (!isOk) {
					lineReader.pause();
				}
			}
		});

		writeStream.on('drain', () => {
			lineReader.resume();
		});

		writeStream.on('finish', async () => {
			lineReader.close();
			this.fileDescriptor?.close();
			this.fileDescriptor = null;

			await fs.unlink(this.url!);
			await fs.rename(tempFileUrl, this.url!);
			this._emit('write', { error: null, data });
		});
	}
	private async _update(transform: TransformFn<T>, evt: DBEvents) {
		if (!this.url) {
			return this._assertPathError();
		}

		const tempFileUrl = this.url + '.temp';
		this.fileDescriptor = await fs.open(this.url, 'r');
		const tempFile = await fs.open(tempFileUrl, 'w');

		const readStream = this.fileDescriptor.createReadStream({ encoding: 'utf-8' });
		const writeStream = tempFile.createWriteStream({ encoding: 'utf-8' });
		const lineReader = readline.createInterface({ input: readStream });

		let previousLine: NullOr<string> = null;

		lineReader.on('line', (line) => {
			const normalizedLine = line.trim();

			if (normalizedLine === '[') {
				return writeStream.write('[\n');
			}

			if (normalizedLine === ']') {
				if (previousLine) {
					const fixedLine = previousLine.replace(/,\s*$/, '');
					writeStream.write(fixedLine + '\n');
					previousLine = null;
				}
				return writeStream.write(']', () => {
					writeStream.end();
				});
			}

			const json = this._sanitizeJsonLine(line);
			const result = transform(this._parseJson(json));

			if (!result) {
				return;
			}

			const data = this._toJson(result);

			if (previousLine) {
				const ok = writeStream.write(previousLine + ',\n');
				if (!ok) lineReader.pause();
			}

			previousLine = data;
		});

		writeStream.on('drain', () => {
			lineReader.resume();
		});

		writeStream.on('finish', async () => {
			lineReader.close();
			this.fileDescriptor?.close();
			this.fileDescriptor = null;

			await fs.unlink(this.url!);
			await fs.rename(tempFileUrl, this.url!);
			this._emit(evt, { error: null, data: null });
		});
	}

	private _emit(key: DBEvents, { error, data }: { error: NullOr<Error>; data: NullOr<T> }) {
		const handlers = this.listeners[key];

		if (!handlers) return this;

		handlers.forEach((handler) => handler(error, data));
		return this;
	}

	public on(key: DBEvents, cb: (err: NullOr<Error>, data: T) => void) {
		this.listeners = this.listeners || {};
		const handlers = this.listeners[key];

		if (!handlers) {
			this.listeners[key] = [];
		}

		this.listeners[key].push(cb);
		return this;
	}

	public once(key: DBEvents, cb: (err: NullOr<Error>, data: T) => void) {
		const wrapper = (err: NullOr<Error>, data: T) => {
			cb(err, data);
			this.off(key, wrapper);
		};

		this.on(key, wrapper);
		return this;
	}

	public off(key: DBEvents, cb: (err: NullOr<Error>, data: T) => void) {
		const handlers = this.listeners[key];
		if (!handlers) return this;

		this.listeners[key] = handlers.filter((fn) => fn !== cb);
		return this;
	}

	public unsubscribe() {
		this.listeners = {} as Listeners;
		return this;
	}

	public cancelReading() {
		this.isReadingCancelled = true;
		return this;
	}

	public read() {
		this._readFile();
		return this;
	}
	public write(data: T) {
		this._writeFile(data);
		return this;
	}
	public update(transform: TransformFn<T>) {
		this._update(transform, 'update');
		return this;
	}
	public delete(transform: TransformFn<T>) {
		this._update(transform, 'delete');
		return this;
	}
}
