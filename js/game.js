var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '');

game.state.add("intro",introState);
game.state.add("menu",menuState);
game.state.add("play",playState);
game.state.start("intro");
