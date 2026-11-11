import path from 'node:path';
import { getContent } from '../lib/content.js';

export default function () {
  return process.env.CONTENT_DIR ? getContent(path.resolve(process.env.CONTENT_DIR)) : getContent();
}
