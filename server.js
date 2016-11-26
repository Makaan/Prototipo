var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/control'));
app.use(express.static(__dirname + '/visor'));
app.use('/dependencias',express.static(__dirname + '/dependencias'));

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
var controles=[];

controlNsp.on('connection',function(socket) {
  console.log('control conectado');
  
  //Cuando ser recibe el nombre
  socket.on('nombre',function setNombre(nombreControl) {
    var encontre=false;
    for(var i=0;i<controles.length;i++) {
      if(controles[i].nombre===nombreControl) {
         encontre=true;
         break;
      }
    }
    //Si el control no existe creo uno nuevo
    if(!encontre) {
      var obj={
        'nombre':nombreControl,
        'x':500,
        'y':300
      };
      controles.push(obj);
      //Lo dibujo en todos los visores
      visorNsp.emit('dibujar',obj);
    }
  });
  
  socket.on('botonArriba', function botonArriba() {
    visorNsp.emit('botonArriba');
  });
  
  socket.on('pressDerecha', function() {
    console.log('press R');
    visorNsp.emit('botonDerechaPress');
  });
  
  socket.on('pressupDerecha', function() {
    console.log('pressup R');
    visorNsp.emit('botonDerechaPressup');
  });
  
  socket.on('pressIzquierda', function() {
    console.log('press L');
    visorNsp.emit('botonIzquierdaPress');
  });
  
  socket.on('pressupIzquierda', function() {
    console.log('pressup L');
    visorNsp.emit('botonIzquierdaPressup');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(__dirname + '/phaser'));
app.get('/phaser',function(req,res) {
  res.sendFile(__dirname+'/phaser/index.html');
});