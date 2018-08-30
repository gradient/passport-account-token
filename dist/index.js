"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var passport_strategy_1 = require("passport-strategy");
var NAME = 'personal-token';
var Strategy = (function (_super) {
    __extends(Strategy, _super);
    function Strategy(options, verify) {
        var _this = this;
        if (!verify) {
            throw new Error('Token strategy requires a verify function');
        }
        if (!options.headerKey) {
            throw new Error('Token strategy requires a header key option');
        }
        _this = _super.call(this) || this;
        _this.name = NAME;
        _this.headerKey = options.headerKey.toLowerCase();
        _this.headerPrefix = options.headerPrefix;
        _this.urlParamKey = options.urlParamKey;
        _this.passReqToCallback = options.passReqToCallback;
        if (verify.length === 2) {
            _this.verify = verify;
        }
        else {
            _this.verifyWithReq = verify;
        }
        return _this;
    }
    Strategy.prototype.authenticate = function (req) {
        var self = this;
        var token;
        var extractedHeader = req.headers[this.headerKey];
        if (extractedHeader) {
            var prefixRegex = new RegExp('^' + this.headerPrefix, 'i');
            if (this.headerPrefix && extractedHeader.match(prefixRegex)) {
                token = extractedHeader.replace(prefixRegex, '').trim();
            }
            else {
                token = extractedHeader;
            }
        }
        // Header takes priority
        if (!token && this.urlParamKey) {
            token = req.params[this.urlParamKey];
        }
        var verified = function (err, user) {
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
            }
            else {
                this.verify(token, verified);
            }
        }
        else {
            // TODO: fill out challenge with a message
            this.fail('', 401);
        }
    };
    return Strategy;
}(passport_strategy_1.Strategy));
exports.Strategy = Strategy;

//# sourceMappingURL=index.js.map
