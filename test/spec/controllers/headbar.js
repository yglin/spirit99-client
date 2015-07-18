'use strict';

describe('Controller: HeadbarCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var HeadbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeadbarCtrl = $controller('HeadbarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HeadbarCtrl.awesomeThings.length).toBe(3);
  });
});
