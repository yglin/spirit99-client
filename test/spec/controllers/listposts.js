'use strict';

describe('Controller: ListpostsCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var ListpostsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListpostsCtrl = $controller('ListpostsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ListpostsCtrl.awesomeThings.length).toBe(3);
  });
});
