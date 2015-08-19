'use strict';

describe('Service: ygPost', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygPost;
  beforeEach(inject(function (_ygPost_) {
    ygPost = _ygPost_;
  }));

  it('should do something', function () {
    expect(!!ygPost).toBe(true);
  });

});
