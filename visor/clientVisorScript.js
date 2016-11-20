var socket=io('/visor');



$( document ).ready(function() {
	
	var canvas = document.getElementById("canvas");
	var contexto = canvas.getContext('2d');

	console.log("documento cargado");
	socket.connect('http://192.168.0.100:3000');
	console.log('conectado '+(socket.connected));
	
	//Cuando recibe que un control presiono el boton
	socket.on('dibujar', function(coordenadas) {
		console.log('coord: '+coordenadas.x+' '+coordenadas.y+' '+canvas.width+' '+canvas.height);
			//if(!(coordenadas.x>canvas.width || coordenadas.x<canvas.width || coordenadas.y>canvas.height || coordenadas.y<canvas.height)) {
			console.log('if');
			contexto.font='Arial 50px';
			contexto.strokeText("8==D",coordenadas.x,coordenadas.y);
		//}
		console.log('dibuje pija');
		
	});
});

var obj= {
	'a':1,
	'b':2,
	'objeto': {
		'x':3
	}
}
