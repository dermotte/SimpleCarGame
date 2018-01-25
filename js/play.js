// sprites
var car, squirrels;

// audio
var squish, bgmusic;

// other
var cursors, emitter, scoreText, winText;

// globals
var car_velocity = 0;
var max_velocity = 550;
var angularVelocity = 150;
var numZombieSquirrels = 50;

var score = 0;
var startTime = 0;
var won = false;

var playState = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.load.image('car', 'assets/images/car_4.png');
        game.load.image('squirrel', 'assets/images/squirrel_2.png');
        game.load.image('smoke', 'assets/images/smoke.png');
        game.load.spritesheet('bloody', 'assets/images/blood_anim.png', 32, 32);
        game.load.audio('squish', 'assets/sound/squish.wav');
        game.load.audio('music', 'assets/sound/one-round-song.mp3');

        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Desert', 'assets/tmw_desert_spacing.png');
    },

    create: function () {

        map = game.add.tilemap('map');
        map.addTilesetImage('Desert');
        layer = map.createLayer('Kachelebene 1');
        layer.resizeWorld();

        squish = game.add.audio('squish');
        bgmusic = game.add.audio('music');
        squirrels = game.add.group();
        squirrels.enableBody = true;

        emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('smoke');
        emitter.gravity = 50;

        // emitter.setXSpeed(0, 0);
        // emitter.setYSpeed(0, 0);

        emitter.setAlpha(0.1, 1, 3000);
        emitter.setScale(0.4, 2, 0.4, 2, 6000, Phaser.Easing.Quintic.Out);

        for (var i = 0; i < numZombieSquirrels; i++) {
            var s = squirrels.create(game.world.randomX, game.world.randomY, 'squirrel');
            s.name = 'squirrels' + s;
            s.body.collideWorldBounds = true;
            s.body.bounce.setTo(0.99, 0.99);
            s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
        }

        car = game.add.sprite(400, 300, 'car');
        car.anchor.set(0.5);
        game.physics.enable(car, Phaser.Physics.ARCADE);

        car.body.collideWorldBounds = true;
        car.body.bounce.set(0.8);
        car.body.allowRotation = true;
        car.body.immovable = true;

        // --- SCORE ---
        scoreText = game.add.text(game.world.centerX, 42, "scored 0 zombie squirrels", { font: "36px Bungee", fill: "#fffe00", align: "center" });
        scoreText.anchor.set(0.5);

        winText = game.add.text(game.world.centerX, game.world.centerY, "Go clear the forest!", { font: "72px Bungee", fill: "#fffe00", align: "center" });
        winText.anchor.set(0.5);


        cursors = game.input.keyboard.createCursorKeys();
        bgmusic.play();
        startTime = this.game.time.totalElapsedSeconds();

        map.setCollisionBetween(31, 48);
        map.setCollisionBetween(1, 3);
        map.setCollisionBetween(9, 11);
        map.setCollisionBetween(17, 21);
        map.setCollisionBetween(25, 29);
        layer.debug = true;
        // sprite = game.add.sprite(260, 70, 'phaser');
        // game.physics.enable(sprite);
        // sprite.body.bounce.set(0.6);
        car.body.tilePadding.set(32);
        game.camera.follow(car);
        // game.physics.arcade.gravity.y = 200;
        // cursors = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        game.physics.arcade.collide(car, squirrels, collisionCallback);
        game.physics.arcade.collide(car, layer);
        game.physics.arcade.collide(squirrels, layer);

        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
        car.body.angularVelocity = 0;

        if (cursors.left.isDown) {
            car.body.angularVelocity = - angularVelocity;
        }
        else if (cursors.right.isDown) {
            car.body.angularVelocity = angularVelocity;
        }

        if (cursors.up.isDown) {
            car_velocity += 10;
            car_velocity = Math.min(car_velocity, max_velocity);
        } else {
            car_velocity -= 10;
            car_velocity = Math.max(car_velocity, 0);

        }
        car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car.angle - 90, car_velocity));
        if (car_velocity > 50) {
            var p1 = new Phaser.Point(0,0);
            p1.x = car.body.x + car.body.width/2;
            p1.y = car.body.y + car.body.height+5;
            p1.rotate(car.body.x + car.body.width/2, car.body.y + car.body.height/2, car.body.rotation, true);
            emitter.position = p1;
            // emitter.x = car.body.x + car.body.width/2;
            // emitter.y = car.body.y + car.body.width/2;

            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            emitter.start(true, 150, null, 7);
        }
        if ((this.game.time.totalElapsedSeconds()-startTime) > 5 && !won) {
            winText.text = "";
        }
        if (score === numZombieSquirrels && !won) {
            winText.text = "You cleared the forest in " + (this.game.time.totalElapsedSeconds()-startTime).toFixed(2) + " seconds!"
            won = true;
        }
    },

    render: function () {

    }
}

function collisionCallback(sprite1, sprite2) {
    if (sprite1.key == "car" && sprite2.key == "squirrel") {
        // console.log("hit Squirrel")
        sprite2.body.immovable = true;
        sprite2.body.velocity.x = 0;
        sprite2.body.velocity.y = 0;
        sprite2.loadTexture("bloody", 0);
        sprite2.animations.add("bloody");
        sprite2.animations.play('bloody', 12, false, true);
        score++;
        scoreText.text = "scored "+score+" zombie squirrels";
        squish.play();
    }
}
