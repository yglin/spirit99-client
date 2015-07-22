'use strict';

describe('Service: ygUserPref', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygUserPref;
  beforeEach(inject(function (_ygUserPref_) {
    ygUserPref = _ygUserPref_;
  }));

  it('should do something', function () {
    expect(!!ygUserPref).toBe(true);
  });

});
