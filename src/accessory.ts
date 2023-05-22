import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicValue,
  Logging,
  Service,
} from 'homebridge';

import { LightBulb } from './lightbulb';

export class Accessory implements AccessoryPlugin {
    private readonly log: Logging;
    private readonly config: AccessoryConfig;
    private readonly api: API;

    private lightbulb: LightBulb;
  
    private readonly informationService: Service;
    private readonly lightbulbService: Service;
  
    private state: CharacteristicValue;
  
    constructor(log: Logging, config: AccessoryConfig, api: API) {
      this.log = log;
      this.config = config;
      this.api = api;
      this.state = false;

      this.lightbulb = new LightBulb(
        'https://api.nature.global',
        config.access_token as string,
        config.signal_id_on as string,
        config.signal_id_off as string,
        config.appliance_id as string,
        log,
      );
  
      this.lightbulbService = new this.api.hap.Service.Lightbulb(
        this.config.name,
      );
      this.lightbulbService
        .getCharacteristic(this.api.hap.Characteristic.On)
        .onGet(async () => {
          return this.lightbulb.status();
        })
        .onSet(async (value) => {
          return value ? this.lightbulb.on() : this.lightbulb.off();
        });
  
      this.informationService = new this.api.hap.Service.AccessoryInformation()
        .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'homebridge.io')
        .setCharacteristic(this.api.hap.Characteristic.Model, 'homebridge')
        .setCharacteristic(this.api.hap.Characteristic.SerialNumber, 'ho-me-br-id-ge');
  
      log.info(
        'lightbulb',
        this.config.name,
        'finished initializing!',
      );
    }
  
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify(): void {
      this.log('lightbulb', this.config.name, 'Identify!');
    }
  
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices(): Service[] {
      return [this.informationService, this.lightbulbService];
    }
}
  