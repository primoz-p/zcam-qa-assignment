import {request as playwrightRequest, test as base} from '@playwright/test';
import {CONFIG} from '../config/env.config';

import {PetApiClient} from '../api/PetApiClient';
import {UserApiClient} from '../api/UserApiClient';

type CustomFixtures = {
  petApi: PetApiClient;
  userApi: UserApiClient;
};

export const test = base.extend<CustomFixtures>({
  petApi: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: CONFIG.API.BASE_URL,
    });
    await use(new PetApiClient(apiContext));
    await apiContext.dispose();
  },
  userApi: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: CONFIG.API.BASE_URL,
    });
    await use(new UserApiClient(apiContext));
    await apiContext.dispose();
  },
});

export {expect} from '@playwright/test';
