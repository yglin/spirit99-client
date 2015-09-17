'use strict';

describe('Service: ygConnect', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygConnect;
  beforeEach(inject(function (_ygConnect_) {
    ygConnect = _ygConnect_;
  }));

  it('should do something', function () {
    expect(!!ygConnect).toBe(true);
  });

});
