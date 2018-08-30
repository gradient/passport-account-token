const assert = require('chai').assert;
const Strategy = require('../dist').Strategy;
const utils = require('./utils');

describe('Account token strategy', function() {
  const stratOptions = {
    headerKey: 'authorization',
    headerPrefix: 'token',
    urlParamKey: 'token'
  };

  it('is named personal-token', function() {
    const strategy = new Strategy(stratOptions, () => {});

    assert.equal(strategy.name, 'personal-token');
  });

  it('requires a verify function', function() {
    const strategy = new Strategy(stratOptions, () => {});

    assert.throws(
      () => { new Strategy({})},
      'Token strategy requires a verify function'
    );
  });

  it('requires a header key', function() {
    const strategy = new Strategy(stratOptions, () => {});

    const verify = () => {};
    assert.throws(
      () => { new Strategy({}, verify)},
      'Token strategy requires a header key option'
    );
  });

  describe('strategy authenticating a request', function() {
    let strategy,
      req,
      params = { token: 'dcba'},
      headers = { authorization: 'abcd' },
      options = { headerKey: 'authorization', urlParamKey: 'token' },
      failed,
      succeeded,
      passedToVerify;

    let fail = () => { failed = true; },
      success = () => { succeeded = true },
      err = () => { throw new Error("should not be called"); };

    beforeEach(function() {
      strategy = new Strategy(options, (token, done) => {
        passedToVerify = token;
        done(null, {});
      });

      failed = false;
      succeeded = false;
      passedToVerify = null;

      strategy.fail = fail;
      strategy.success = success;
      strategy.error = err;
    });

    it('fails if no headers or params are provided', function() {
      req = utils.dummyReq({}, {});

      strategy.authenticate(req);

      assert.isTrue(failed);
    });

    it('passes extracted header token to verify callback', function() {
      req = utils.dummyReq({}, headers);

      strategy.authenticate(req);

      assert.equal(passedToVerify, headers.authorization);
    });

    it('passes extracted param token to verify callback', function() {
      req = utils.dummyReq(params, {});

      strategy.authenticate(req);

      assert.equal(passedToVerify, params.token);
    });

    it('succeeds if the verify callback provided a user', function() {
      strategy = new Strategy(options, (token, done) => {
        done(null, {});
      });

      strategy.fail = strategy.error = err;
      strategy.success = success;

      req = utils.dummyReq({}, headers);

      strategy.authenticate(req);

      assert.isTrue(succeeded);
    });

    it('fails if the verify callback provides false instead of a user', function() {
      strategy = new Strategy(options, (token, done) => {
        done(null, false);
      });

      strategy.fail = fail;
      strategy.success = strategy.error = err;

      req = utils.dummyReq({}, headers);

      strategy.authenticate(req);

      assert.isTrue(failed);
    });

    it('fails if the verify callback provides an error', function() {
      strategy = new Strategy(options, (token, done) => {
        done(new Error('error from verify callback'));
      });

      let ok = false;
      strategy.error = () => { ok = true };
      strategy.success = strategy.fail = err;

      req = utils.dummyReq({}, headers);

      strategy.authenticate(req);

      assert.isTrue(ok);
    });

    it('passes the request object to the verify callback when directed', function() {
      let passedReq;

      strategy = new Strategy({
        headerKey: options.headerKey,
        passReqToCallback: true,
      }, (req, token, done) => {
        passedReq = req;
        done(null, {});
      });

      strategy.fail = fail;
      strategy.success = success;

      req = utils.dummyReq({}, headers);

      strategy.authenticate(req);

      assert.isFalse(failed);
      assert.isTrue(succeeded);

      assert.equal(passedReq, req);
    });
  });
});
