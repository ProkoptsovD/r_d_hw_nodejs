import http from 'node:http';
import { config } from './config/index.ts';
import router from './lib/router.ts';

export function runServer() {
	const server = http.createServer();

	server.on('request', router);

	server.listen(config.port, config.host, () => {
		console.log('Server starting on ', `http://${config.host}:${config.port}`);
	});

	return server;
}

runServer();
