import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicDir = join(root, 'public');
const uvConfigPath = join(publicDir, 'uv', 'uv.config.js');
const customUvConfig = existsSync(uvConfigPath) ? readFileSync(uvConfigPath, 'utf8') : null;

mkdirSync(publicDir, { recursive: true });

cpSync(uvPath, join(publicDir, 'uv'), { recursive: true, force: true });
cpSync(epoxyPath, join(publicDir, 'epoxy'), { recursive: true, force: true });
cpSync(baremuxPath, join(publicDir, 'baremux'), { recursive: true, force: true });

if (customUvConfig) {
  writeFileSync(uvConfigPath, customUvConfig);
}

const favicon = join(root, 'favicon (1).webp');
if (existsSync(favicon)) {
  cpSync(favicon, join(publicDir, 'favicon.webp'), { force: true });
  cpSync(favicon, join(publicDir, 'favicon.ico'), { force: true });
}
