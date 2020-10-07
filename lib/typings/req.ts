import { IncomingMessage } from 'http';

export interface Req extends IncomingMessage {
  body: object | string;
  params: object;
  query: object;
  setParams(params?: any[], values?: any[]): void;
  getHeader(name: string): string | string[] | undefined;
}
