import { ServerResponse } from 'http';

export interface Res extends ServerResponse {
  status(code: number): Res;
  send(param: any): void;
  json(object: object): void;
}
