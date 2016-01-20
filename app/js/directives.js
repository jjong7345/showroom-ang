'use strick';

/* Directives */

var showroomDirectives = angular.module('showroomDirectives',[]);

showroomDirectives.directive('gameBlock', ['Game', '$rootScope', function(Game, $rootScope) {
    return {
        restrict: 'AE',
        scope:{ 
                datasource: '=datasource',
                index: '=index'
            },
        link: function($scope, $element, $attrs) {
            
            $scope.text = "un-clicked";
            $element.on('click', function() {
                $scope.games = "clicked";
            });

            //console.log($scope.datasource);

            var game = new Game($element, $scope.datasource);
            game.setOrderNo($scope.index);
            var winResizeHandler = $rootScope.$on('winResize', function(event, winResize) { game.updateSize(winResize); });
            var winStateHandler = $rootScope.$on('onReState', function(event, val) { game.updateState(); });
            $scope.$on('$destroy', winResizeHandler);
            $scope.$on('$destroy', winStateHandler);


        },
        template: '<img class="shadow" src="images/shadow.png"><img src="http://h5gshowroom.com/Social/games/{{datasource.id}}/images/gameroom.jpg"><a class="prevent-link"></a>',
    };
}]);