var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

 
	app.use(express.static(__dirname + '/control'));
	app.use(express.static(__dirname + '/visor'));
	app.use('/dependencias',express.static(__dirname + '/dependencias'));
	app.use('/resources',express.static(__dirname+'/resources'));
	
	//Archivo visor
	app.get('/visor', function enviarVisor(req, res){
	  res.sendFile(__dirname + '/visor/visor.html');
	});
	
	
	//Archivo con control
	app.get('/control', function enviarControl(req, res) {
	  res.sendFile(__dirname + '/control/control.html');
	});

//Namespaces para controls y visores
var visorNsp=io.of('/visor');
var controlNsp=io.of('/control');

var visors=[];

visorNsp.on('connection', function(socket){
  //Cuando se conecta un visor dibuja todo pidiendole a uno de los visores, si no no hace nada
  console.log('conectado');
	if(visors.indexOf(socket)===-1)
		visors.push(socket);
	console.log(visors.length);
  
	
	
  socket.on('disconnect',function() {
    var index=visors.indexOf(socket);
    if(index>-1)
      visors.splice(index,1);
		console.log('desconectado '+visors.length);
  });
  
	socket.on('stateNew',function stateNew() {
		if(visors.indexOf(socket)!==0) {
			console.log('emit '+socket.id+" "+visors[0].id);
			visors[0].emit('getState');
			visors[0].on('state',function(entities) {
				socket.emit('setState',entities);
			});
  }
	});
});



//Controles
var controls={};

controlNsp.on('connection',function(socket) {
  controls[socket.id]={'name':""};
  //Cuando ser recibe el nombre
  socket.on('playerName',function setNombre(nombreControl) {
    controls[socket.id].name=nombreControl;
    visorNsp.emit('newPlayer',nombreControl);
  });
  
  socket.on('pressUp', function(name) {
    visorNsp.emit('upPress',name);
  });
  
  socket.on('pressupUp', function(name) {
    visorNsp.emit('upPressup',name);
  });
  
  socket.on('pressRight', function(name) {
    visorNsp.emit('rightPress',name);
  });
  
  socket.on('pressupRight', function(name) {
    visorNsp.emit('rightPressup',name);
  });
  
  socket.on('pressLeft', function(name) {
    visorNsp.emit('leftPress',name);
  });
  
  socket.on('pressupLeft', function(name) {
    visorNsp.emit('leftPressup',name);
  });
  
  socket.on('disconnect', function() {
    console.log(controls[socket.id].name);
    visorNsp.emit('disconnected',controls[socket.id].name);
    delete controls[socket];
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
