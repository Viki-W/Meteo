var app = angular.module('todo', ['ngRoute','ngResource']);

app.config(function($routeProvider){
	$routeProvider.
    when('/', {
      controller:'TodoCtrl',
      templateUrl:'partials/today.html'
    }).
	when('/history', {
      controller:'TodoCtrl',
      templateUrl:'partials/history.html'
    }).
	otherwise({
      redirectTo:'/'
    });
});

app.factory('Todos', ['$resource', function ($resource) {
	return $resource('/todo/api/:id', { id: '@id' }, {
          'update': { method:'PUT' }
      });	
}]);		

app.controller('TodoCtrl', ['$scope', '$filter', 'Todos', 
    function TodoCtrl($scope, $filter, Todos) {
		$scope.todos = Todos.query();
				
		$scope.addTodo = function () {
            if($scope.newTodo) {
                var newTodo = {
                    'title': $scope.newTodo,
                    'done': false,
					'archived': false
                };
                Todos.save(newTodo, function (data) {
					$scope.todos.push(data);
					$scope.newTodo = '';
				});
            }
        };

		$scope.deleteAll = function () {
			Todos.delete({ 'archived' : true }, 
				function (data) {
					$scope.todos = Todos.query();
				},
				function (err) {
					console.log('Failed to archive: ' + err);
				});
        };	
		
		$scope.archive = function () {
			Todos.update({ 'done' : true }, { 'archived' : true },
			function (data) {
				$scope.todos = Todos.query();
			},
			function (err) {
			    console.log('Failed to archive: ' + err);
			});
        };			
		
		$scope.done = function (todo) {
			Todos.update({ id : todo._id }, { done : todo.done },
			function (data) {
				//console.log('Mark done.');
			},
			function (err) {
			    console.log('Failed to mark done: ' + err.title);
			});
        };
				
		$scope.editTitle = function (todo) {
			$scope.originalTodo = angular.extend({}, todo);;
            todo.editing = true;			
        };
		
		$scope.updateTitle = function (todo) {		
			Todos.update({ id : todo._id }, { title : todo.title }, 
			function (data) {
				delete todo.editing;				
			},
			function (err) {
			    console.log('Failed to update the title: ' + err);
			});	
        };
		
		$scope.cancelTitle = function (todo) {		
			delete todo.editing;
			$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
        };
		
		$scope.cancelNew = function () {		
			$scope.newTodo = '';
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

app.directive('today', function($interval, $filter) {
    return function(scope, element, attrs) {
      var format = 'MM/dd/yyyy', 
      stopTime;
	  
	  updateTime();

      function updateTime() {
        element.text($filter('date')(new Date(), format));
      }
		
      stopTime = $interval(updateTime, 60000);

      element.bind('$destroy', function() {
        $interval.cancel(stopTime);
      });
    }
  });

app.filter('notArchived', function() {
   return function(items, archived) {
    var filtered = [];
    angular.forEach(items, function(item) {
      if(item.archived === undefined || item.archived === false){
        filtered.push(item);
      }
    });
    return filtered;
  };
});





