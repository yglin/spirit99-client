'use strict';

describe('Service: ygStatusInfo', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygStatusInfo;
  beforeEach(inject(function (_ygStatusInfo_) {
    ygStatusInfo = _ygStatusInfo_;
  }));

  it('should do something', function () {
    expect(!!ygStatusInfo).toBe(true);
  });

});
