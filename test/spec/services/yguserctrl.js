'use strict';

describe('Service: ygUserCtrl', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygUserCtrl;
  beforeEach(inject(function (_ygUserCtrl_) {
    ygUserCtrl = _ygUserCtrl_;
  }));

  it('should do something', function () {
    expect(!!ygUserCtrl).toBe(true);
  });

});
