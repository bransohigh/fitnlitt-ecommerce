// Hostinger entry point — bridges ESM root to CommonJS server
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('./server/index.js');
