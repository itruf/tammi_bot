'use strict';

let cli   = require('heroku-cli-util');
let nock  = require('nock');
let sinon = require('sinon');
let cmd   = require('../../commands/app');

describe('hello:app', function () {
  beforeEach(function () {
    this.cliDebug = sinon.stub(cli, 'debug');
  });

  afterEach(function () {
    this.cliDebug.restore();
  });

  it('displays the app info and config vars', function () {
    let self   = this;
    let app    = {name: 'myapp', web_url: 'https://myapp.herokuapp.com/'};
    let config = {FOO: 'bar'};

    nock('https://api.heroku.com')
    .get('/apps/myapp')
    .reply(200, app);

    nock('https://api.heroku.com')
    .get('/apps/myapp/config-vars')
    .reply(200, config);

    return cmd.run({app: 'myapp'})
    .then(function () {
      self.cliDebug.should.have.been.calledWith(app);
      self.cliDebug.should.have.been.calledWith(config);
    });
  });
});
