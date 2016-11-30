var socket=io('/visor');

var entities={};

$( document ).ready(function() {
	
	
	console.log("documento cargado");
	socket.connect('http://192.168.0.100:3000');
	console.log('conectado '+(socket.connected));
	
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
	
	function preload() {
		game.load.image('ship', '/resources/images/ship.png');
	}
	
	function create() {
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = '#0072bc';
		
	
	}
	function update() {
		for (var name in entities) {
			if (entities.hasOwnProperty(name)) {
				entity=entities[name];
				game.physics.arcade.velocityFromAngle(entity.player.angle, entity.velocity, entity.player.body.velocity);
				entity.text.x = Math.floor(entity.player.x);
				entity.text.y = Math.floor(entity.player.y)-entity.player.height/2-3;
			}
		}
	}
	
	socket.on('newPlayer',function(name) {
		console.log(name);
		// The player and its settings
		var player = game.add.sprite(400, 300, 'ship');
		//  We need to enable physics on the player
		game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
		//  Player physics properties. Give the little guy a slight bounce.
		
		player.body.collideWorldBounds = true;
		//  Our two animations, walking left and right.
		player.anchor.setTo(0.5, 0.5);
		
		 var style = { font: "11px Arial", wordWrap: true, wordWrapWidth: player.width, align: "center"};

		text = game.add.text(0, 0, name, style);
		text.anchor.set(0.5);
		
		entities[name]={
			'player':player,
			'text':text,
			'velocity':0
		};
	});
	
	socket.on('botonArribaPress', function(name) {
		entities[name].velocity=300;
	});
	
	socket.on('botonArribaPressup',function(name) {
		entities[name].velocity=0;
	});
	
	socket.on('botonDerechaPress', function(name) {
		entities[name].player.body.angularVelocity = 200;
		entities[name].player.animations.play('right');
	});
	
	socket.on('botonDerechaPressup', function(name) {
		entities[name].player.body.angularVelocity = 0;
		entities[name].player.animations.play('idle');
	});
	
	socket.on('botonIzquierdaPress', function(name) {
		entities[name].player.body.angularVelocity = -200;
		entities[name].player.animations.play('left');
	});
	
	socket.on('botonIzquierdaPressup', function(name) {
		entities[name].player.body.angularVelocity = 0;
		entities[name].player.animations.play('idle');
	});
	
});
