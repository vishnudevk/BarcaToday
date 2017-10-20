var app = angular.module('barcaApp', []).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });

app.controller('matchCtrl', function($scope, $http) {

    $scope.myTeamId = 81; //team id of barca, TODO it may change every season

    $scope.team1 = {name:"FC Barcelona",crest:"https://upload.wikimedia.org/wikipedia/de/a/aa/Fc_barcelona.svg"};
    $scope.team2 = {name:"Olympiacos F.C.",crest:"https://upload.wikimedia.org/wikipedia/de/9/96/Logo_Olympiakos_Piräus.svg"};


    $scope.fixtures = [];


     $scope.loadFixtures = function(){
        var url = 'http://api.football-data.org/v1/teams/'+$scope.myTeamId+'/fixtures';
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"')+"&format=json" ;//+ '&format=xml&callback=cbFunc';
        //var resturl = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20json%20WHERE%20url%3D%22http%3A%2F%2Fapi.football-data.org%2Fv1%2Fteams%2F81%2Ffixtures%22&format=json";
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
            $scope.fixtures = data.data.query.results.json.fixtures;
       });

    }
    
    $scope.loadFixtures();
});