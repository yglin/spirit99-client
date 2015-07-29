'use strict';

describe('Service: ygUtils', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygUtils;
  beforeEach(inject(function (_ygUtils_) {
    ygUtils = _ygUtils_;
  }));

  it('should do something', function () {
    expect(!!ygUtils).toBe(true);
  });

});
