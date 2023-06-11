import Axios from 'axios';
import { Logging } from 'homebridge';
import assert from 'assert';

type Appliance = {
    'id': string;
    'light': {
      'state': {
        'brightness': string;
        'last_button': string;
        'power': string;
      };
    };
  };

export class LightBulb {

    protected readonly endpoint: string;
    protected readonly token: string;
    protected readonly signal_id_on: string;
    protected readonly signal_id_off: string;
    protected readonly appliance_id: string;
    protected log: Logging;
    private last_state_fetch_time?: Date;
    private cached_status?: boolean;

    constructor(
      endpoint: string,
      token: string,
      signal_id_on: string,
      signal_id_off: string,
      appliance_id: string,
      log: Logging,
    ) {
      this.endpoint = endpoint;
      this.token = token;
      this.signal_id_on = signal_id_on;
      this.signal_id_off = signal_id_off;
      this.appliance_id = appliance_id;
      this.log = log;
    }

    public async status(): Promise<boolean> {
      const now = new Date();

      if (this.last_state_fetch_time === undefined || now.getTime() - this.last_state_fetch_time.getTime() > 1000 * 60 * 5) {
        this.last_state_fetch_time = now;
        this.cached_status = await this.getStatus();
        return Promise.resolve(this.cached_status!);
      } else {
        return Promise.resolve(this.cached_status!);
      }
    }

    private async getStatus(): Promise<boolean> {
      return Axios.get('/1/appliances/', {
        baseURL: this.endpoint,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      }).then(
        (response) => {
          let appliances: Appliance[] = [];
          try {
            this.log.debug('response is ', response.data);
            appliances = JSON.parse(JSON.stringify(response.data));
          } catch (e) {
            if (e instanceof SyntaxError) {
              throw new Error('Unexpected response from Nature Remo API:' + e);
            }
          }

          const light = this.findAppliance(appliances, this.appliance_id);

          if (light === null) {
            throw new Error('Specified light is not found');
          } else {
            const powerState = light.light.state.power; 
            this.log.info('powerState is ', powerState);
            return powerState === 'on' ? true : false;
          }
        },
        (err) => {
          throw new Error(err);
        },
      );
    }

    private findAppliance(appliances: Appliance[], appliance_id: string) {
      for (const appliance of appliances) {
        if (appliance.id === appliance_id) {
          return appliance;
        }
      }
      return null;
    }

    public async on(): Promise<void> {
      this.log.info('Setting lightbulb state to ON');
      await this.changeLightStateOnRemoServer('on');
      return this.send(this.signal_id_on).then(
        () => {
          this.log.info('Completed Setting lightbulb state to ON');
          this.cached_status = true;
        },
        (err) => {
          this.log.warn('Fail to send signal to nature remo api endpoint. ', err);
        },
      );
    }

    public async off(): Promise<void> {
      this.log.info('Setting lightbulb state to OFF');
      await this.changeLightStateOnRemoServer('off').then(
        () => {
          this.log.info('light off');
        },
        (err) => {
          this.log.error('light off failed: ', err);
        },
      );
      return this.send(this.signal_id_off).then(
        () => {
          this.log.info('Completed Setting lightbulb state to OFF');
          this.cached_status = false;
        },
        (err) => {
          this.log.warn('Fail to send signal to nature remo api endpoint. ', err);
        },
      );
    }

    private async send(signal_id: string): Promise<void> {
      return Axios.post('/1/signals/' + signal_id + '/send', null, {
        baseURL: this.endpoint,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    private async changeLightStateOnRemoServer(state: string): Promise<void> {
      assert(state === 'on' || state === 'off');
      return Axios.post('/1/appliances/' + this.appliance_id + '/light', 'button=' + state, {
        baseURL: this.endpoint,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        },
      });
    }
}
