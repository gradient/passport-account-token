import { Request } from 'express';
import { Strategy as BaseStrategy } from 'passport-strategy';

export interface StrategyOptions {
  headerKey: string;
  headerPrefix?: string;
  urlParamKey?: string;
  passReqToCallback?: boolean;
}

export type VerifyCallback = (error: Error, user?: any) => void;
export type VerifyAction = (token: string, callback: VerifyCallback) => void;
export type VerifyActionWithReq = (
  req: Request,
  token: string,
  callback: VerifyCallback
) => void;

export class Strategy extends BaseStrategy {
  public name: string;

  constructor(options: StrategyOptions, verify: VerifyAction | VerifyActionWithReq);

  authenticate(req: Request): void;
}