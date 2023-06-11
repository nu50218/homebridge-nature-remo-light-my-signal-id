import { Logging } from 'homebridge';

export class LoggingMock {
    public static readonly prefix: string = '[MOCK]';

    static init(): Logging {

      const log = function (message: string, ...parameters: unknown[]): void {
        console.log(`[INFO] [MOCK] ${message}`, parameters);
      };

      log.prefix = this.prefix;

      log.info = (message: string, ...parameters: unknown[]): void => {
        console.log(`[INFO] ${this.prefix} ${message}`, parameters);
      };

      log.warn = (message: string, ...parameters: unknown[]): void => {
        console.log(`[INFO] ${this.prefix} ${message}`, parameters);
      };

      log.error = (message: string, ...parameters: unknown[]): void => {
        console.log(`[INFO] ${this.prefix} ${message}`, parameters);
      };

      log.debug = (message: string, ...parameters: unknown[]): void => {
        console.log(`[INFO] ${this.prefix} ${message}`, parameters);
      };

      log.log = (level: string, message: string, ...parameters: unknown[]): void => {
        console.log(`[${level}] ${this.prefix} ${message}`, parameters);
      };

      return log;

    }
}