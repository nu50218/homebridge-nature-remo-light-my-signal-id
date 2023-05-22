import {
  API,
} from 'homebridge';

import { Accessory } from './accessory';

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  api.registerAccessory('homebridge-nature-remo-light-my-signal-id', Accessory);
};
