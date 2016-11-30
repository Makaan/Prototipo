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

//namespaces
var visorNsp=io.of('/visor');
var controlNsp=io.of('/control');

visorNsp.on('connection', function(){
  console.log("visor conectado");
  //Cuando se conecta un visor dibuja todo
  for(var i=0;i<controles.length;i++) {
    socket.emit('dibujar',controles[i]);
  }
});

//Controles
var controles={};

controlNsp.on('connection',function(socket) {
  console.log('control conectado');
  controles[socket]={'name':""};
  //Cuando ser recibe el nombre
  socket.on('nombre',function setNombre(nombreControl) {
    controles[socket].name=nombreControl;
    visorNsp.emit('newPlayer',nombreControl);
  });
  
  socket.on('pressArriba', function(name) {
    visorNsp.emit('botonArribaPress',name);
  });
  
  socket.on('pressupArriba', function(name) {
    visorNsp.emit('botonArribaPressup',name);
  });
  
  socket.on('pressDerecha', function(name) {
    visorNsp.emit('botonDerechaPress',name);
  });
  
  socket.on('pressupDerecha', function(name) {
    visorNsp.emit('botonDerechaPressup',name);
  });
  
  socket.on('pressIzquierda', function(name) {
    visorNsp.emit('botonIzquierdaPress',name);
  });
  
  socket.on('pressupIzquierda', function(name) {
    visorNsp.emit('botonIzquierdaPressup',name);
  });
  
  socket.on('disconnect', function() {
    visorNsp.emit('disconnected',controles[socket].name);
    delete controles[socket];
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
