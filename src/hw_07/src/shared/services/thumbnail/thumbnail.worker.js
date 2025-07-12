import { parentPort, workerData } from 'node:worker_threads';
import sharp from 'sharp';

/**
 * @typedef {Object} WorkerMessage
 * @property {{ url: string, output: { width: number, height: number } }} data
 * @property {string} id
 */

/** @type {WorkerMessage} */
const resource = workerData;
const DEFAULT_CONFIG = {
  width: 150,
  height: 150,
};

function log(msg) {
  parentPort.postMessage(msg);
}

(async function createThumbnail() {
  log(`Worker ${resource.id} starting...`);

  const width = resource.data.output?.width ?? DEFAULT_CONFIG.width;
  const height = resource.data.output?.height ?? DEFAULT_CONFIG.height;
  sharp(resource.data.url)
    .resize({ width, height })
    .toBuffer()
    .then((buffer) => {
      parentPort.postMessage({ buffer, workerId: resource.id, success: true });
    })
    .catch((error) => {
      parentPort.postMessage({
        buffer: null,
        workerId: resource.id,
        success: false,
        reason: error?.message || 'Unknown',
      });
    })
    .finally(() => {
      log(`Worker ${resource.id} fininshed!`);
    });
})();
