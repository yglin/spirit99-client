'use strict';

describe('Controller: StoryeditorcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('spirit99App'));

  var StoryeditorcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoryeditorcontrollerCtrl = $controller('StoryeditorcontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StoryeditorcontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
