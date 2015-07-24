'use strict';

describe('Controller: ProgresscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var ProgresscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProgresscontrollerCtrl = $controller('ProgresscontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProgresscontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
