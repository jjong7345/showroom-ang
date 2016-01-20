'use strick';

/* Controllers */

var showroomControllers = angular.module('showroomControllers',[]);

showroomControllers.controller('gameListCtrl',['$scope', 'GameData', '$rootScope', 'Swiper', '$window', function($scope, GameData, $rootScope, Swiper, $window) {
    GameData.getData().success(function(data) {
        init(data);
    });

    function init(data) {
        $scope.games = data;
        
        Swiper = new Swiper();
        Swiper.initSwiper();

        initWindowResize();
    
        var winResizeHandler = $rootScope.$on('winResize', function(event, winwidth) { console.log(winwidth); });
        $scope.$on('$destroy', winResizeHandler);
    }

    function initWindowResize() {
        var w = angular.element($window);
        var winWidth;
        var blockAspectRatio = 182 / 244;
        var numRowOnWin = 6;
        var newTileWidth;
        var newTileHeight;
        
        var timer;
        w.resize(function() {
            timer = setTimeout(function() {
                clearTimeout(timer);
                var tempWidth = winWidth / numRowOnWin;
                if ((newTileWidth) && (typeof newTileWidth != "undefined")) {
                    tempWidth = newTileWidth;
                }

                winWidth = w.width();

                newTileWidth = winWidth / numRowOnWin;

                var r = newTileWidth / tempWidth;

                newTileHeight = newTileWidth * blockAspectRatio;

                
                $rootScope.$emit('winResize', {
                    width: newTileWidth,
                    height: newTileHeight
                });

                $rootScope.$emit('onReState', null);

                jQuery(".game").height(newTileHeight);
                jQuery(".games-container").width(newTileWidth * Math.ceil(50 / 2));
                jQuery(".swiper-container").height(Math.floor(newTileWidth * 2));
                jQuery(".swiper-scrollbar").css({
                    "margin-top": Math.floor(newTileWidth * 1.7) + "px"
                });
                
                Swiper.reInit();
                Swiper.setSlideNewPos(Swiper.getSlideCurrXPos() * r, 0);
            }, 300);
        }).resize();
    }
}]);



