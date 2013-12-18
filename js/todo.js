angular.module('todo', ['ngCookies']).
controller('TodoCtrl', ['$scope', '$http', '$filter', '$cookieStore',
    function TodoCtrl($scope, $http, $filter, $cookieStore) {
        $scope.today = $filter('date')(new Date(),'MM/dd/yyyy');
        $scope.dataUrl = $scope.today.replace(/\//g,'') + '.json';
        
        $scope.todos = angular.fromJson($cookieStore.get('allTodos'));
        //console.log($scope.todos);
        if (!$scope.todos){
            $scope.todos = [{
                    summary: ((function () {
                        var today = new Date();
                        var firstDay = new Date("2013/11/12");
                        var days = parseInt((today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24), 0);
                        return 'Vocabulary Unit ' + days;
                        }))(),
                    done: false
                }];
        }            
                    
        $scope.addTodo = function () {
            if($scope.todoSummary) {
                var newTodo = {
                    'summary': $scope.todoSummary, 
                    'done': false 
                };
                $scope.todos.push(newTodo);
                $scope.todoSummary = '';
                $scope.saveCookie();
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
            $scope.saveCookie();
        };
        
        $scope.saveCookie = function(){
            $cookieStore.put('allTodos',angular.toJson($scope.todos));
        };    
}]);
