var socket=io('/visor');
socket.connect('http://192.168.1.110:3000');
//Guardo aca las entidades en el juego
var entities={};

var game;

$( document ).ready(function() {
	
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});
	
	function preload() {
		game.load.image('ship', '/resources/images/ship.png');
	}
	
	function create() {
		//Incializo el juego
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = '#0072bc';
		game.stage.disableVisibilityChange=true;
		socket.emit('stateNew');
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
	
	socket.on('newPlayer',function newPlayer(name) {
		console.log(name);
		// Incio el jugador nuevo
		initPlayer(name,400,300,0,0);
	});
	
	socket.on('disconnected',function disconnect(name) {
		console.log(name);
		entities[name].player.destroy();
		entities[name].text.destroy();
		delete entities[name];
	});
	
	socket.on('upPress', function upPress(name) {
		entities[name].velocity=300;
	});
	
	socket.on('upPressup',function upPressup(name) {
		entities[name].velocity=0;
	});
	
	socket.on('rightPress', function rightPress(name) {
		entities[name].player.body.angularVelocity = 200;
		entities[name].player.animations.play('right');
	});
	
	socket.on('rightPressup', function rightPressup(name) {
		entities[name].player.body.angularVelocity = 0;
		entities[name].player.animations.play('idle');
	});
	
	socket.on('leftPress', function leftPress(name) {
		entities[name].player.body.angularVelocity = -200;
		entities[name].player.animations.play('left');
	});
	
	socket.on('leftPressup', function leftPressup(name) {
		entities[name].player.body.angularVelocity = 0;
		entities[name].player.animations.play('idle');
	});
	
	socket.on('getState',function getState() {
		var obj={};
		for (var name in entities) {
			if (entities.hasOwnProperty(name)) {
				obj[name]={
					'x': entities[name].player.x,
					'y': entities[name].player.y,
					'angle': entities[name].player.angle,
					'velocity': entities[name].velocity
				};
				console.log(name);
			}
		}
		socket.emit('state',obj);
	});
	
	socket.on('setState',function setState(obj) {
		for (var name in obj) {
			if (obj.hasOwnProperty(name)) {
				console.log(name);
				initPlayer(name, obj[name].x, obj[name].y, obj[name].angle, obj[name].velocity); 	
			}
		}
	});


	function initPlayer(name,x,y,angle,velocity) {
		var player = game.add.sprite(x, y, 'ship');
		player.angle = angle;
		game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
			
		//Estilo para el texto;
		var style = { font: "11px Arial", wordWrap: true, wordWrapWidth: player.width, align: "center"};
		
		var text = game.add.text(0, 0, name, style);
		text.anchor.set(0.5);
			
		entities[name]={
			'player':player,
			'text':text,
			'velocity':velocity
		};
	}

});