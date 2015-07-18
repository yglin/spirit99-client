'use strict';

describe('Controller: SearchpaneCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var SearchpaneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchpaneCtrl = $controller('SearchpaneCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SearchpaneCtrl.awesomeThings.length).toBe(3);
  });
});
