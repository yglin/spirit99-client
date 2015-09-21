'use strict';

describe('Controller: StatusinfoCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var StatusinfoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatusinfoCtrl = $controller('StatusinfoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StatusinfoCtrl.awesomeThings.length).toBe(3);
  });
});
