'use strict';

describe('Service: ygError', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygError;
  beforeEach(inject(function (_ygError_) {
    ygError = _ygError_;
  }));

  it('should do something', function () {
    expect(!!ygError).toBe(true);
  });

});
