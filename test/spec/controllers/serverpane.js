'use strict';

describe('Controller: ServerpaneCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var ServerpaneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServerpaneCtrl = $controller('ServerpaneCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ServerpaneCtrl.awesomeThings.length).toBe(3);
  });
});