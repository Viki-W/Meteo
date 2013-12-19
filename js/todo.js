angular.module('todo', []).
controller('TodoCtrl', ['$scope', '$http', '$filter',
    function TodoCtrl($scope, $http, $filter) {
        $scope.today = $filter('date')(new Date(), 'MM/dd/yyyy');

        $http.get('/todo/api').
            success(function (data) {
                $scope.todos = data;
            });

        if($scope.todos === undefined || $scope.todos === null){
            $scope.todos = [{
                summary: ((function () {
                    var today = new Date(),
                        firstDay = new Date("2013/11/11"),
                        oneDay = 1000 * 60 * 60 * 24,
                        days = parseInt((today.getTime() - firstDay.getTime()) / oneDay, 0);
                    return 'Vocabulary Unit ' + days;
                }))(),
                done: false
            }];
        }

        $scope.saveData = function (){
            $http.post('/todo/api', JSON.stringify($scope.todos)).
            success(function(){
                //console.log('Saved data');
            }).
            error(function(){
                console.log('Failed to save data');
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
            }
        };

        $scope.archive = function () {
            var oldTodos = $scope.todos;
            $scope.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) {
                    $scope.todos.push(todo);
                }
            });
            $scope.saveData();
        };

}]);
