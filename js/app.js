var app = angular.module('peg', []);
app.factory('Grammar', function () {
  return $("#grammar").html();
});
app.factory('Parser', ['Grammar', function (Grammar) {
  return PEG.buildParser(Grammar);
}]);
app.controller('MainCtrl', function ($scope, Grammar, Parser) {
  $scope.env = {};
  $scope.debug = false;
  $scope.grammar = Grammar;
  $scope.vars = ['x', 'y'];
  
  $scope.isValid = function (expr) {
    try {
      Parser.parse(expr);
      return true;
    } catch(e) {
      return false;
    }
  };
  
  $scope.isEmptyOrBoolean = function (value) {
    return $scope.isEmpty(value) || $scope.isBoolean(value);
  };
  
  $scope.isEmpty = function (value) {
    if (value === null) return true;
    if (value === undefined) return true;
    if ((/^\s*$/).test(value)) return true;
    
    return false;
  };
  
  $scope.isBoolean = function (value) {
    return (/^\s*(true|false|yes|no)\s*$/).test(value);
  };
  
  $scope.remove = function (variable) {
    delete $scope.env[variable];
    $scope.vars.splice($scope.vars.indexOf(variable), 1);
    console.log($scope.vars);
  };
  
  $scope.add = function () {
    var variable = $scope.addvar;
    if ($scope.isEmpty(variable)) return;
    if (!(/^[a-z]+$/).test(variable)) return;
    if ($scope.vars.indexOf(variable) > -1) return;
    
    $scope.vars.push(variable);
    $scope.addvar = '';
  };
  
  $scope.evaluate = function (expr, env) {
    $scope.result = null;
    
    var vars = $scope.vars;
    
    for (var i = 0; i < vars.length; ++i) {
      var variable = vars[i]
        , value = env[variable];
        
      if (!$scope.isEmptyOrBoolean(value)) {
        $scope.error = "Variable `" + variable + "' is not a boolean: " + value;
        return null;
      }
    }
   
    try {
      var tree = Parser.parse(expr);
      $scope.result = tree.evaluate(env);
      $scope.error = null;
      return $scope.result;
    } catch(e) {
      $scope.error = e.message;
      return null;
    }
  };
}); 