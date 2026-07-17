import type { API } from 'homebridge';

import { CalendarStatePlatform } from './platform';
import { PLATFORM_NAME } from './settings';

export = (api: API): void => {
  api.registerPlatform(PLATFORM_NAME, CalendarStatePlatform);
};
