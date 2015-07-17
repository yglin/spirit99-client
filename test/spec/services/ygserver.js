'use strict';

describe('Service: ygServer', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygServer;
  beforeEach(inject(function (_ygServer_) {
    ygServer = _ygServer_;
  }));

  it('should do something', function () {
    expect(!!ygServer).toBe(true);
  });

});
