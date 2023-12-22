import Path from './pathlibx.js';
import { execSync } from 'node:child_process';
import { version } from '../src/modules/version.js';

const MOD_NAME = 'atrack';

const distRoot = new Path('./dist');
const buildDir = new Path(`game/game/js/mod/mods/${MOD_NAME}`);
const assetDir = new Path('./assets');

distRoot.mkdirSync({ existOk: true });
const distDir = distRoot.t(`${MOD_NAME}-${version}`);
distDir.mkdirSync({ existOk: true });
const distArchivePath = distDir.withName(distDir.name + '.zip');

assetDir.cpSync(distDir, { recursive: true });

buildDir.cpSync(distDir.t(buildDir.name));

execSync(
  `cd "${distDir.parent()}" && zip -r "${distArchivePath.resolve()}" "${
    distDir.name
  }/"`
);
