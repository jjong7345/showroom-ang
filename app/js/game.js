$(document).ready(function() {

    H5G.Game.bindPlayButtonClick();
    H5G.Game.bindGameInfoTrigger();

});

H5G.namespace('Game');

H5G.Game.Flash = false;

H5G.Game.bindPlayButtonClick = function() {

    $(document).on('click', '.game-play-trigger', function(e) {

        $(".ui-dialog-content").dialog("close");

        var container = $('#game-modal');
        var gameLink  = $(this);
        var gameId    = gameLink.data('game-id');
        var padding   = 36 * 2;
        var border    = 2 * 2;
        var inset     = 2;
        
        $('#game-modal-availability-button').data('game-id', gameId);

        e.preventDefault();

        container.dialog({
            height: 597 + padding + border + inset,
            width: 760 + padding + border + inset,
            resizable: false,
            modal: true,
            open: function(event, ui) {
                H5G.Game.loadGame(gameLink);

                $(".ui-widget-overlay").css({
                    background:"#fff",
                    opacity: ".95"
                });
            },
            create: function(event, ui) {
                $(window).resize(function() {
                    container.dialog('option', 'position', 'center');
                });
            },
            close: function(event, ui) {
                l('close modal, remove game swf');
                //H5G.Game.Flash.onGameClose();
                swfobject.removeSWF('flash-content');
                //create an empty flash-content div for next load
                $(".flash-content-container").html("<div id='flash-content'></div>");
            },
            beforeClose: function(event, ui) {
                $(".ui-widget-overlay").css({
                    background:"#000",
                    opacity: ".75"
                });
            },
            show: {
                effect:"fade"
            },
            hide: {
                effect:"fade"
            }
        });

    });

};

H5G.Game.loadGame = function(gameLink) {
    var swfVersionStr = '10.2.153';
    var xiSwfUrlStr   = 'expressInstall.swf';
    var flashvars     = {};
    var params        = {};
    var attributes    = {};
    var gameId        = gameLink.data('game-id');

    if (H5G.config.electroServer) {
        flashvars.serverip = escape(H5G.config.electroServer);
    }

    flashvars.hostname      = H5G.config.hostname;
    flashvars.token         = H5G.config.user.token.encryptedToken;
    flashvars.email         = H5G.config.user.user.email;
    flashvars.showIGTLogo   = gameLink.data('game-show-igt').toString();
    flashvars.showBallyLogo = gameLink.data('game-show-bally').toString();
    flashvars.gameId        = gameId;

    l('game loading...');
    l('flashvars:');
    l(flashvars);
    l('game id: ' + gameId);

    //make sure that flash-content div exist
    if ($('#flash-content').length <= 0) {
        //otherwise create one
        $(".flash-content-container").html("<div id='flash-content'></div>");
    }

    params.bgcolor           = '#000000';
    params.wmode             = 'opaque';
    params.name              = 'flash-content';
    params.allowscriptaccess = 'sameDomain';
    params.allowfullscreen   = 'true';

    swfobject.embedSWF(
        '/Social/ShowroomWrapper.swf',
        'flash-content',
        '760px',
        '630px',
        swfVersionStr,
        xiSwfUrlStr,
        flashvars,
        params,
        attributes,
        swfobjectCallback
    );
};

H5G.Game.bindGameInfoTrigger = function() {

    $('.game-modal-availability-button').click(function(e) {

        var gameId = $(this).data('game-id');

        ShowRoom.openGameInfo(ShowRoom.getGame(gameId), "game-availability-container");

        e.preventDefault();
    });
};

function swfobjectCallback(e) {
    if (true == e.success) {
        H5G.Game.Flash = document.getElementById(e.id);

        l('flash embed success');

        setTimeout(function() {
            H5G.Game.Flash.tabIndex = 0;
            H5G.Game.Flash.focus();

            l('set flash focus');

        }, 500);

    } else {
        // JSON.stringify() will not work in IE 7 and lower
        H5G.log('flash embed failed: ' + JSON.stringify(e), 10, 'game.js', 'swfobjectCallback');
    }
}

function gameLoadComplete() {
    l('game loaded, WOOHOO!');

    $('#game-preloader').fadeOut();
}
