var app = angular.module('barcaApp', ['ngSanitize']).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });

app.controller('matchCtrl', function($scope, $http, $anchorScroll, $location) {

    $scope.myTeamId = 81; //team id of barca, TODO it may change every season
    $scope.nextMatch;
    $scope.matchNumber = 0;

    $scope.fixtures = [];
    $scope.liveLinks = [];
    $scope.news = [];

    $scope.showLive = true; 
    $scope.showNews = false;
    $scope.showStandings = false;
    $scope.showFixtures = false;

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
                if(obj1.status==='SCHEDULED' || obj1.status==='TIMED'){
                    obj2 = $scope.fixtures[i-1];
                    $scope.matchNumber = i;
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
        });

        yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + $scope.nextMatch._links.awayTeam.href + '"')+"&format=json" ;//+ '&format=xml&callback=cbFunc';
       
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
           $scope.nextMatch.awayTeam = data.data.query.results.json;
        });


    }

    $scope.getLiveLinks = function(){
        var qry = 'select * from htmlstring where url="http://www.ronaldo7.net/video/barcelona-live/barcelona-live-streaming.html"';
        var yql = 'https://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(qry)+"&format=json&env=https://raw.githubusercontent.com/spier/yql-tables/banklz/alltables_forked.env";
        //TODO change the env url when its up
        //yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlstring%20where%20url%3D'http%3A%2F%2Fwww.ronaldo7.net%2Fvideo%2Fbarcelona-live%2Fbarcelona-live-streaming.html'&format=json&env=http://datatables.org/alltables.env"
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){

            var src = data.data.query.results.result;

            while(true){
                if(src.indexOf('<a class="style208" href="')>0){
                    src = src.substring(src.indexOf('<a class="style208" href="')+26, src.length);
                    var link = {};
                    link.url = src.substring(0, src.indexOf(' rel')-1);
                    if(link.url != "http://www.ronaldo7.net/video/barcelona-live/barcelona-live-streaming.html")
                    $scope.liveLinks.push(link);
                }else{
                    src = "";
                    break;
                }
            }

         });

    }

    $scope.getNews = function(){
        var qry = 'select * from rss where url="https://feedity.com/fcbarcelona-com/WlZbWlpR.rss"';
        var yql = 'https://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(qry)+"&format=json";
        $http.jsonp(yql, {jsonpCallbackParam: 'callback'}).then(function(data){
            $scope.news = data.data.query.results.item;
        });
    }

    $scope.liveClick = function(){
        $scope.showLive = true; 
        $scope.showNews = false;
        $scope.showStandings = false;
        $scope.showFixtures = false;
    }

    $scope.newsClick = function(){
        $scope.showLive = false; 
        $scope.showNews = true;
        $scope.showStandings = false;
        $scope.showFixtures = false;
    }


    $scope.standingsClick = function(){
        $scope.showLive = false; 
        $scope.showNews = false;
        $scope.showStandings = true;
        $scope.showFixtures = false;
    }

    $scope.fixturesClick = function(){
        $scope.showLive = false; 
        $scope.showNews = false;
        $scope.showStandings = false;
        $scope.showFixtures = true;
        setTimeout(function(){
            $location.hash('match'+($scope.matchNumber-1));
            $anchorScroll();
        },100);
    }

    
    $scope.loadFixtures();
    $scope.getLiveLinks();
    
    $scope.getNews();

});


var floatstatus = false ;//false means floating button is closed

 function clickFloat(){
    if(floatstatus){
        document.getElementById("menu").setAttribute('data-mfb-state','closed');
        floatstatus = false;
    }else{
        document.getElementById("menu").setAttribute('data-mfb-state','open');
        floatstatus = true;
    }
}
