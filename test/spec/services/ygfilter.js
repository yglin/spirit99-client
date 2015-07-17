'use strict';

describe('Service: ygFilter', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygFilter;
  beforeEach(inject(function (_ygFilter_) {
    ygFilter = _ygFilter_;
  }));

  it('should do something', function () {
    expect(!!ygFilter).toBe(true);
  });

});
