import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function isRunningInDocker(): boolean {
  try {
    const cgroup = readFileSync('/proc/1/cgroup', 'utf8');
    return /docker|containerd|kubepods/.test(cgroup);
  } catch {
    return false;
  }
}

export function loadEnvironment() {
  const isCI =
    process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const isDocker = process.env.IS_DOCKER === 'true' || isRunningInDocker();

  const envFile = isCI || isDocker ? '.env' : '.env.test';
  const envPath = join(process.cwd(), envFile);

  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.debug(
      `✅ Ambiente: ${isCI ? 'CI' : isDocker ? 'Docker' : 'Local'} | Arquivo carregado: ${envFile}`,
    );
  } else {
    dotenv.config();
  }

  // Define DB_SSL baseado no ambiente
  if (isDocker || isCI) {
    process.env.DB_SSL = 'false';
  } else {
    process.env.DB_SSL = undefined;
  }
}
