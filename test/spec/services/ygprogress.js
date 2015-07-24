'use strict';

describe('Service: ygProgress', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygProgress;
  beforeEach(inject(function (_ygProgress_) {
    ygProgress = _ygProgress_;
  }));

  it('should do something', function () {
    expect(!!ygProgress).toBe(true);
  });

});
