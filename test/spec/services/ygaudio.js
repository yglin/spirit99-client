'use strict';

describe('Service: ygAudio', function () {

  // load the service's module
  beforeEach(module('spirit99App'));

  // instantiate service
  var ygAudio;
  beforeEach(inject(function (_ygAudio_) {
    ygAudio = _ygAudio_;
  }));

  it('should do something', function () {
    expect(!!ygAudio).toBe(true);
  });

});
