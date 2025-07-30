import { loadEnvironment } from '@Shared/config/load-env';
loadEnvironment(); // agora carregamento dinâmico

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export async function setupE2EApp(): Promise<INestApplication> {
  console.time('🟡 E2E Setup');
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  console.timeEnd('🟡 E2E Setup');
  return app;
}