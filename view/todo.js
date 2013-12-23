var app = angular.module('todo', []);
app.controller('TodoCtrl', ['$scope', '$http', '$filter',
    function TodoCtrl($scope, $http, $filter) {
        $scope.today = $filter('date')(new Date(), 'MM/dd/yyyy');
		
        $http.get('/todo/api').
            success(function (data) {
                $scope.todos = data;
        });
        
		$scope.addTodo = function () {
            if($scope.newTodo) {
                var newTodo = {
                    'title': $scope.newTodo,
                    'done': false 
                };
                $http.post('/todo/api', newTodo).
                success(function(data){
                    $scope.todos = data;
                    $scope.newTodo = '';
                }).
                error(function(data){
                    console.log('Failed to add: ' + data);
                });
            }
        };

        $scope.updateTodo = function (id, key, value) {
            $http.put('/todo/api/' + id + "?" + key + "=" + value).
                success(function(data){
                    $scope.todos = data;
                }).
                error(function(data){
                    console.log('Failed to update: ' + data);
            });
        };

        $scope.archive = function () {
            $http.delete('/todo/api').
                success(function(data){
                    $scope.todos = data;
                }).
                error(function(data){
                    console.log('Failed to archive: ' + data);
            });
        };		
		
		$scope.done = function (todo) {
            $scope.updateTodo(todo._id, 'done', todo.done);
        };	
		
		$scope.editTitle = function (todo) {
			$scope.originalTitle = todo.title;
            todo.editing = true;			
        };
		
		$scope.saveTitle = function (todo) {	            
			$scope.updateTodo(todo._id, 'title', todo.title);
			delete todo.editing;
        };
		
		$scope.cancel = function (todo) {		
			todo.title = $scope.originalTitle;
			delete todo.editing;
        };

}]);

app.directive('onEsc', function() {
  var ESCAPE_KEY = 27;
  return function(scope, elem, attr) {
    elem.bind('keydown', function(event) {
      if (event.keyCode === ESCAPE_KEY) {
        scope.$apply(attr.onEsc);
      }
    });
  };
});

app.directive('onEnter', function() {
  var ENTER_KEY = 13;
  return function(scope, elem, attr) {
    elem.bind('keypress', function(event) {
      if (event.keyCode === ENTER_KEY) {
        scope.$apply(attr.onEnter);
      }
    });
  };
});

app.directive('onFocus', function($timeout, $parse) {
  return {
	link: function (scope, elem, attrs){
		var model = $parse(attrs.onFocus);
		scope.$watch(model, function(value){
			if (value === true) {
				$timeout(function () {
					elem[0].focus();
			  });
			}
		});
		elem.bind('blur', function () {
			scope.$apply(model.assign(scope,false));
		});		
	}
  };
});





