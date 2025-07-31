// test/utils/e2e-wrapper.ts
import { INestApplication } from '@nestjs/common';

import { setupE2EApp } from './setup-e2e';

export function e2eDescribe(
  name: string,
  callback: (getApp: () => INestApplication) => void,
) {
  describe(name, () => {
    let app: INestApplication;

    beforeAll(async () => {
      app = await setupE2EApp();
    });

    afterAll(async () => {
      await app?.close();
    });

    const getApp = () => {
      if (!app) throw new Error('App not initialized yet');
      return app;
    };

    callback(getApp);
  });
}
