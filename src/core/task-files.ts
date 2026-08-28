/**
 * Durable filesystem helpers shared by the task registry.
 *
 * They moved out of the attested-run module so the registry keeps its
 * fsync-on-write guarantees without depending on that surface.
 */

import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { isJsonObject } from './common.js';
import { replaceFileDurable, writeFileDurable } from './durable-fs.js';

export async function writeFileFsynced(path: string, data: Buffer | string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFileDurable(path, data);
}

export async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  await replaceFileDurable(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function closeAndFsyncOutputStream(
  stream: NodeJS.WritableStream | undefined,
): Promise<void> {
  if (!stream) return;
  await new Promise<void>((resolvePromise, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      stream.off('error', fail);
      stream.off('close', finish);
      stream.off('finish', finish);
      resolvePromise();
    };
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      stream.off('close', finish);
      reject(error);
    };
    stream.once('close', finish);
    stream.once('finish', finish);
    stream.once('error', fail);
    stream.end();
  });
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isJsonObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortJson(value[key])]),
  );
}
