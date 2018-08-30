import { Strategy as BaseStrategy } from 'passport-strategy';
import * as express from 'express';
import {
  StrategyOptions,
  VerifyAction,
  VerifyActionWithReq,
  VerifyCallback
} from './definitions';

const NAME = 'personal-token';

export class Strategy extends BaseStrategy {
  public name: string;

  private headerKey: string;
  private headerPrefix: string;
  private urlParamKey: string;
  private passReqToCallback: boolean;

  private verify: VerifyAction;
  private verifyWithReq: VerifyActionWithReq;

  constructor(
    options: StrategyOptions,
    verify: VerifyAction | VerifyActionWithReq
  ) {
    if (!verify) {
      throw new Error('Token strategy requires a verify function');
    }

    if (!options.headerKey) {
      throw new Error('Token strategy requires a header key option');
    }

    super();

    this.name = NAME;

    this.headerKey = options.headerKey.toLowerCase();
    this.headerPrefix = options.headerPrefix;
    this.urlParamKey = options.urlParamKey;

    this.passReqToCallback = options.passReqToCallback;

    if (verify.length === 2) {
      this.verify = verify as VerifyAction;
    } else {
      this.verifyWithReq = verify as VerifyActionWithReq;
    }
  }

  public authenticate(req: express.Request): void {
    const self = this;

    let token: string;

    const extractedHeader: string = req.headers[this.headerKey] as string;
    if (extractedHeader) {
      const prefixRegex = new RegExp('^' + this.headerPrefix, 'i');

      if (this.headerPrefix && extractedHeader.match(prefixRegex)) {
        token = extractedHeader.replace(prefixRegex, '').trim();
      } else {
        token = extractedHeader;
      }
    }

    // Header takes priority
    if (!token && this.urlParamKey) {
      token = req.params[this.urlParamKey];
    }

    const verified: VerifyCallback = (err: Error, user: any) => {
      if (err) {
        return self.error(err);
      }

      if (!user) {
        // TODO: fill out challenge with a message
        return self.fail('', 401);
      }

      // TODO: update passport-strategy types to make info optional
      // and fail challenge / status should be optional
      self.success(user, {});
    };

    if (token) {
      if (this.passReqToCallback) {
        this.verifyWithReq(req, token, verified);
      } else {
        this.verify(token, verified);
      }
    } else {
      // TODO: fill out challenge with a message
      this.fail('', 401);
    }
  }
}
