angular.module('todo', []).
controller('TodoCtrl', ['$scope', '$http', '$filter', 
    function TodoCtrl($scope, $http, $filter) {
        $scope.today = $filter('date')(new Date(),'MM/dd/yyyy');
        $scope.dataUrl = $scope.today.replace(/\//g,'') + '.json';	
		
		$http.get('/todo/api').
		    success(function(data){
				$scope.todos = data;
			}).
			error(function(){
				$scope.todos = [{
					summary: ((function () {
						var today = new Date();
						var firstDay = new Date("2013/11/12");
						var days = parseInt((today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24), 0) + 1;
							return 'Vocabulary Unit ' + days;
						}))(),
					done: false
				}];
			});	
		
		$scope.saveData = function(){
			$http.post('/todo/api', JSON.stringify($scope.todos)).
				success(function(){
					console.log('Data Saved ');
				}).
			error(function(){
				console.log('Failed to save data ');
			});
        }; 
                                   
        $scope.addTodo = function () {
            if($scope.todoSummary) {
                var newTodo = {
                    'summary': $scope.todoSummary,
                    'done': false 
                };
                $scope.todos.push(newTodo);
				$scope.todoSummary = '';
				$scope.saveData();
				console.log('55' + $scope.todos );
            }		
        };

        $scope.archive = function () {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) {
                    $scope.todos.push(todo);
					$scope.saveData();
                }
            });
        };
        
		
   
}]);
