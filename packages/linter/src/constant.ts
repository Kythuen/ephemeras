import { fileURLToPath, resolve } from 'node:url'

export const PROJECT_ROOT = resolve(fileURLToPath(import.meta.url), '..')
