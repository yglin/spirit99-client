'use strict';

describe('Service: ygInit', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygInit;
  beforeEach(inject(function (_ygInit_) {
    ygInit = _ygInit_;
  }));

  it('should do something', function () {
    expect(!!ygInit).toBe(true);
  });

});
