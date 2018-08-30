# Passport Account Token Strategy

<a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
</a>

> A [passport.js](http://passportjs.org/) strategy for authenticating by a
token passed in the URL params or the request header.

When offering a public API, a simple way of authenticating a request is by
requiring a client to pass a token that is stored against
a particular user. The clients requests then act on behalf of the user who owns
the unique token.

This library provides a passport.js strategy that extracts a token from a
specified header or URL parameter and allows you to verify
it with your own implementation code.

## Usage

Create the strategy with an options object and a "verify request" callback.
This callback allows you to check the extracted token with your own logic,
such as a database lookup.

### Options

* `headerKey` - **[this or `urlParamKey` must be provided]**. A single string
representing a HTTP header
name to extract a token from.
* `urlParamKey` - **[this is `headerKey` must be provided]**. A single string
representing the URL parameter key to extract a token from.

_One or more of the above options must be specified. Only specified keys will
be used to extract a token. For example, if the `urlParamKey` is not provided
then you cannot use this to pass your token._

* `passReqToCallback` - Instructs the strategy to pass the full Express
Request object through to the verify callback.

The verify callback lets you decide whether to authenticate a request or not.
It is called every time a request uses this strategy. It will be supplied the
extracted token and a passport.js `done` callback. You can optionally get the
full express request object as well.

```js
var passport = require('passport');
var Strategy = require('passport-account-token').Strategy;

var options = {
    headerKey: 'authorization',
    urlParamKey: 'token'
};

passport.use(new Strategy(options, (token, done) => {
    let user = null;

    // Replace the following with your custom authentication logic,
    // you might wish to lookup the "token" in a database for example.
    if (token === 'abc123') {
        user = { username: 'test' };
    }

    // Return a "user" object representing the user. This will
    // later be attached to the req.user object by Passport.js.
    done(null, user);
});
```

If you wish to be given the full express `request` object, you can set the
`passReqToCallback` option to `true`.

```js
var passport = require('passport');
var Strategy = require('passport-account-token').Strategy;

var options = {
    headerKey: 'authorization',
    urlParamKey: 'token',
    passReqTocallback: true // Instruct the strategy to give you the req.
};

passport.use(new Strategy(options, (req, token, done) => {
    // You now have access to the "req" object from Express.

    let user = null;

    // Your custom authentication logic...
    if (token === 'abc123') {
        user = { username: 'test' };
    }

    done(null, user);
});
```

## Development

This project is written in TypeScript, to run the tests you must first run
a build of the TypeScript.

### Installing dependencies

```sh
$ yarn install
```

### Building the project
```sh
$ yarn build
```

### Running tests

Tests are written in JavaScript so we can test edge cases that the TypeScript
and TSNode compilers don't allow (such as not providing required fields).

```sh
$ yarn test
```
