var app = angular.module('todo', []);

app.factory('todoFactory', ['$http', function ($http) {
		
		var urlBase = '/todo/api';		
		var todoFactory = {};
		
		todoFactory.getTodos = function () {
			return 	$http.get(urlBase);		
		};

		todoFactory.insertTodo = function (todo) {
			return $http.post(urlBase, todo);
		};
		
		todoFactory.updateTodo = function (id, update) {
			return $http.put(urlBase + '/' + id, update);
		};
	
		todoFactory.deleteTodos = function () {
			return $http.delete(urlBase);
		};
		
		return todoFactory;
}]);

app.controller('TodoCtrl', ['$scope', '$filter', 'todoFactory',
    function TodoCtrl($scope, $filter, todoFactory) {
        $scope.today = $filter('date')(new Date(), 'MM/dd/yyyy');
	
		getTodos();
		
		function getTodos() {
			todoFactory.getTodos()
            .success(function (data) {
                $scope.todos = data;
            })
            .error(function (err) {
                $scope.todos = [];
				console.log ("Unable to get todos" + err);
            });
		};
        
		$scope.addTodo = function () {
            if($scope.newTodo) {
                var newTodo = {
                    'title': $scope.newTodo,
                    'done': false
                };
                todoFactory.insertTodo(newTodo).
				success(function(data){
                    $scope.todos = data;
                    $scope.newTodo = '';
                }).
                error(function(err){
                    console.log('Failed to add: ' + err);
                });
            }
        };

		$scope.archive = function () {
            todoFactory.deleteTodos().
            success(function(data){
                $scope.todos = data;
             }).
            error(function(err){
                console.log('Failed to archive: ' + err);
            });
        };	
		
		$scope.done = function (todo) {
			todoFactory.updateTodo(todo._id, { done : todo.done }).
				success(function(data){
					$scope.todos = data;
				}).
                error(function(err){
                    console.log('Failed to complete: ' + err);
				});
        };	
				
		$scope.editTitle = function (todo) {
			$scope.originalTodo = angular.extend({}, todo);;
            todo.editing = true;			
        };
		
		$scope.saveTitle = function (todo) {
			todoFactory.updateTodo(todo._id, { title : todo.title}).
				success(function(data){
					delete todo.editing;
					$scope.todos = data;
                }).
                error(function(err){
                    console.log('Failed to update the title: ' + err);
            });
        };
		
		$scope.cancel = function (todo) {		
			delete todo.editing;
			$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
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

app.filter('notArchived', function() {
   return function(items, archived) {
    var filtered = [];
    angular.forEach(items, function(item) {
      if(archived === undefined || archived === false){
        filtered.push(item);
      }
    });
    return filtered;
  };
});





