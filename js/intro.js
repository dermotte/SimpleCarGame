var introState = {
    preload: function() {
        game.load.video('introVideo', 'assets/Guy_Named_Like_Trees_Intro.mp4');
        game.load.image('skip', 'assets/images/skip.png');
    },
    create: function() {
        var video = game.add.video('introVideo');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //  See the docs for the full parameters
        //  But it goes x, y, anchor x, anchor y, scale x, scale y
        var sprite = video.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 1, 1);
        video.loop = false;
        video.onComplete.add(function() {
            console.log("Video completed.")
            video.destroy();
            game.state.start("menu");
        });
        var skip = game.add.sprite(16, 16, 'skip');

        skip.inputEnabled = true;
        skip.events.onInputDown.add(function() {
            game.state.start("menu");
            video.destroy()
        });

        video.play(false);
    },
    update: function() {

    }
};