angular.module('todo', []).
controller('TodoCtrl', ['$scope', '$http', '$filter',
    function TodoCtrl($scope, $http, $filter) {
        $scope.today = $filter('date')(new Date(), 'MM/dd/yyyy');

        $http.get('/todo/api').
            success(function (data) {
                $scope.todos = data;
        });

        $scope.addTodo = function () {
            if($scope.todoSummary) {
                var newTodo = {
                    'summary': $scope.todoSummary,
                    'done': false 
                };
                $http.post('/todo/api', newTodo).
                success(function(data){
                    $scope.todos = data;
                    $scope.todoSummary = '';
                }).
                error(function(data){
                    console.log('Failed to add: ' + data);
                });
            }
        };

        $scope.update = function (id, isDone) {
            $http.put('/todo/api/' + id + "?done=" + isDone).
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

}]);
