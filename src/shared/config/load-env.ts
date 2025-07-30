import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

export function loadEnvironment() {
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  const envFile = isCI ? '.env' : '.env.test';
  const envPath = join(process.cwd(), envFile);

  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Carregado arquivo de env: ${envFile}`);
  } else {
    dotenv.config(); // fallback para .env padrão
    console.warn('⚠️ Nenhum arquivo .env específico encontrado, usando padrão');
  }
}
