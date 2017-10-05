var app = angular.module('noteApp', ['restangular', 'base64']);

app.config(function(RestangularProvider,$base64) {
    // Add Base url of the file where you can get the notes from
    RestangularProvider.setBaseUrl('https://shdw6b6fe553.int.sap.hana.ondemand.com/hana-070849/');
});



app.controller('mainCtrl', ['$scope', '$log', 'Restangular', '$http', 
     function($scope, l, Restangular, $http) {

    Restangular.setFullResponse(true);
    $scope.note = "";
    $scope.notes = [];
    $scope.allTodos = [];
    $scope.triggerError = false;
    
    $scope.AddNote = function() {

        // POST request that will post the note to the database
        // Send todoId and the $scope.note to the backend as a POST request
        var path = 'demo-app-service.xsodata/DATA';
        var noteDiary = Restangular.all(path);
        var newNote = { ID : "1323",
                        NOTE : $scope.note }
        noteDiary.post(newNote);
        $scope.note = "";

        setTimeout(function() {
            $scope.getAllNotes();
        }, 3000);
    };

    $scope.deleteNote = function(id) {
        console.log(id);

        var query = 'demo-app-service.xsodata/DATA(' + id + ')';
        Restangular.one(query).remove(id);

        setTimeout(function() {
            $scope.getAllNotes();
        }, 1000);
    }

    var homeUrl = '';

    $scope.getAllNotes = function() {
            Restangular.one('demo-app-service.xsodata/DATA').get().then(function(result){
                $scope.allTodos = result.data.d.results;
            }, function(response){
                console.error("Connection to SAP servers is not possible right now. Please try again later");
                $scope.triggerError = true;
            });
        };



}]);


