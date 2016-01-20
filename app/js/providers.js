'use strict';

/* Providers */


showroomApp.factory('GameData', ['$http', function($http) {
   var exports = {};

   exports.getData = function () {
        return $http.get('data/games.json')
            .success(function (data) {
            })
            .error(function (data) {
                console.log('There was an error!', data);
            });
   };

   return exports;
}]);



showroomApp.factory('Swiper', function() {
    return function() {
        var mySwiper;

        function initSwiper() {

            mySwiper = new Swiper('.swiper-container', {
                freeMode: true,
                keyboardControl: false,
                freeModeFluid: true,
                slidesPerView: 'auto',
                mousewheelControl: false,
                scrollcontainer: true,
                preventLinksPropagation: true,
                preventLinks: true,
                calculateHeight: true,
                scrollbar: {
                    container: ".swiper-scrollbar",
                    draggable: true,
                    hide: false,
                    snapOnRelease: false
                }
            });

        }
        function reInit() {
            mySwiper.reInit();
        }

        function getSlideCurrXPos() {

            return mySwiper.getWrapperTranslate("x");

        }

        function setSlideNewPos(_pos, _speed) {

            mySwiper.setWrapperTransition(_speed);
            mySwiper.setWrapperTranslate(_pos, 0, 0);
        }

        return {
            initSwiper:initSwiper,
            reInit:reInit,
            getSlideCurrXPos:getSlideCurrXPos,
            setSlideNewPos:setSlideNewPos
        };
    };
});

showroomApp.factory('Game', function() {

    var isCSSTransform3D = true;

    //Create Game Class for each game
    function Game(_el, _data) {

        var THIS = this;
        this.el = _el;
        this.data = _data;

        for (var property in _data) {
            THIS[property] = _data[property];
        }

        //attach click
        this.el.on("click", function(e) {
            //console.log(allowClick);

            //var gameId    = THIS.id;
            openGameInfo(THIS, "game-detail-container");
            //e.preventDefault();

        });

        if (isCSSTransform3D) {
            this.el.css({
                "transform": "translate3d(0px, -3000px, 0px)"
            });
        } else {
            this.el.css({
                "transform": "translateY(-3000px)"
            });
        }

        return this;

    };

    Game.prototype.setOrderNo = function(_index) {

        var THIS = this;
        this.orderNo = _index;

    };

    Game.prototype.getTitles = function(_titleArray) {

        var titles = [];

        jQuery.each(_titleArray, function(index, value) {
            if ((_titleArray[index].title) && (_titleArray[index].title != "undefined") && (_titleArray[index].title != "")) {

                var result = _titleArray[index].title
                    .replace(/\+/g, ' ')
                    .replace(/(\w+)/g, function(string) {
                        return string.substr(0, 1).toUpperCase() + string.substr(1, string.length);
                    });

                titles.push(result);
            }
        });

        var titlesConcat = "";

        if (titles.length > 0) {
            titlesConcat = titles.join(", ");
        }
        return titlesConcat;

    };

    Game.prototype.getFeatures = function() {

        if ((this.features) && (typeof this.features != "undefined") && (this.features.length > 0)) {
            return this.getTitles(this.features);
        } else {
            return false;
        }

    };

    Game.prototype.getMarkets = function() {

        if ((this.market) && (typeof this.market.title != "undefined")) {
            return this.market.title.replace(/\+/g, ' ');
        } else {
            return false;
        }

    };

    Game.prototype.getLongDescription = function() {

        return this.longDescription.replace(/\+/g, ' ');

    };

    Game.prototype.getMechanics = function() {

        if ((this.mechanics) && (typeof this.mechanics != "undefined") && (this.mechanics.length > 0)) {
            return this.mechanics.replace(/\+/g, ' ');
        } else {
            return false;
        }

    };

    Game.prototype.isPlayable = function() {

        return 3000 > parseInt(this.id);

    };

    Game.prototype.showIgtLogo = function() {

        return String(this.hasLandBasedDistribution('igt'));

    };

    Game.prototype.showBallyLogo = function() {

        return String(this.hasLandBasedDistribution('bally'));

    };

    Game.prototype.getPublisher = function() {

        var publisher;

        if (jQuery.isArray(this.publishers) && this.publishers.length > 0) {

            publisher = this.publishers[0];

            return publisher.title;
        }
        
        return false;
    };

    Game.prototype.hasLandBasedDistribution = function(_title) {

        var flag = false;

        if (jQuery.isArray(this.releases)) {

            jQuery.each(this.releases, function(index, val) {

                if ((typeof val.platform == "undefined") && (typeof val.distribution == "undefined")) {
                    return;
                }

                if ('platforms-land-based' !== val.platform.slug) {
                    return;
                }

                if (_title.toLowerCase() === val.distribution.title.toLowerCase()) {
                    //console.log(_title.toLowerCase() +":"+val.distribution.title.toLowerCase());
                    flag = true;
                    return false;
                }

            });
        }

        return flag;

    };

    Game.prototype.updateSize = function(_data) {

        this.width = _data.width;
        this.height = _data.height;
        this.el.width(this.width);
        console.log(this.width);

    };

    Game.prototype.updateState = function(_data) {

        //console.log("orderNo: "+this.orderNo);
        var THIS = this;

        setTimeout(function() {
            if ((THIS.orderNo != null) && (THIS.orderNo != "undefined")) {
                THIS.el.fadeIn(200);
                THIS.x = Math.floor(THIS.orderNo / 2) * THIS.width;
                THIS.y = ((THIS.orderNo % 2) == 1) ? THIS.height : 0;
                if (isCSSTransform3D) {
                    THIS.el.css({
                        "transform": "translate3d(" + THIS.x + "px, " + THIS.y + "px, 0px)"
                    });
                } else {
                    THIS.el.css({
                        "transform": "translateX(" + THIS.x + "px) translateY(" + THIS.y + "px)"
                    });
                }
                setTimeout(function() {
                    THIS.el.css({
                        "z-index": 2
                    });
                }, 500);
            } else {
                THIS.el.css({
                    "z-index": 1
                });
                THIS.el.fadeOut(350);
                //var y = ((this.orderNo % 2) == 1) ?600 : -200 ;

                //console.log(THIS.orderNo);
                //this.el.css({"transform":"translateX(-300px)"});

                if (isCSSTransform3D) {
                    THIS.el.css({
                        "transform": "translate3d(" + THIS.x + "px, " + THIS.y + "px, 0px) scale3d(0.6, 0.6, 1)"
                    });
                }
            }
        }, 2 * THIS.orderNo);

    };

    return (Game);
});







