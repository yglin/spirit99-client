'use strict';

describe('Controller: InfowindowcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var InfowindowcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InfowindowcontrollerCtrl = $controller('InfowindowcontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InfowindowcontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
