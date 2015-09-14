'use strict';

describe('Service: ygFollowPost', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygFollowPost;
  beforeEach(inject(function (_ygFollowPost_) {
    ygFollowPost = _ygFollowPost_;
  }));

  it('should do something', function () {
    expect(!!ygFollowPost).toBe(true);
  });

});
