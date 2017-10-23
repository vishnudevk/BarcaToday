var app = angular.module('barcaApp', []).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });

app.controller('matchCtrl', function($scope, $http) {

    $scope.myTeamId = 81; //team id of barca, TODO it may change every season
    $scope.nextMatch;

    $scope.fixtures = [];


     $scope.loadFixtures = function(){
        var url = 'http://api.football-data.org/v1/teams/'+$scope.myTeamId+'/fixtures';
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"')+"&format=json" ;//+ '&format=xml&callback=cbFunc';
        
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
            $scope.fixtures = data.data.query.results.json.fixtures;
            $scope.getNextMatch()
       });

    }

    $scope.getNextMatch = function(){
        var i, obj1, obj2;
        var len = $scope.fixtures.length
        for (i=0; i<len; ++i) {
            if (i in $scope.fixtures) {
                var obj1 = $scope.fixtures[i];
                if(obj1.status==='SCHEDULED'){
                    obj2 = $scope.fixtures[i-1];
                    break;
                }
            }
        }

        var now = new Date();
        
        if(new Date(obj1.date).getTime()-now.getTime() < now.getTime() - new Date(obj2.date).getTime()){
            $scope.nextMatch = obj1;
            var futureDate  = new Date($scope.nextMatch.date);
            var diff = futureDate.getTime() / 1000 - now.getTime() / 1000;
    
            clock = $('.match-clock').FlipClock(diff, {
                clockFace: 'DailyCounter',
                countdown: true
            });

        }else{
            $scope.nextMatch = obj2;
        }

        $scope.getTeamDetails();
    }

    $scope.getTeamDetails = function(){

        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + $scope.nextMatch._links.homeTeam.href + '"')+"&format=json" ;//+ '&format=xml&callback=cbFunc';
        
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
            $scope.nextMatch.homeTeam = data.data.query.results.json;
            //$state.reload();
        });

        yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + $scope.nextMatch._links.awayTeam.href + '"')+"&format=json" ;//+ '&format=xml&callback=cbFunc';
       
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
           $scope.nextMatch.awayTeam = data.data.query.results.json;
           //$state.reload();
        });


    }

   
    
    $scope.loadFixtures();
});