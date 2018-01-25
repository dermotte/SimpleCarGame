var menuState = {
    preload: function() {
        game.load.image('menu', 'assets/images/menu.jpg');
    },
    create: function() {
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        var menu = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
        menu.anchor.set(0.5);
        menu.inputEnabled = true;
        menu.events.onInputDown.add(function() {
            game.state.start("play");
        });

    },
    update: function() {

    }
};