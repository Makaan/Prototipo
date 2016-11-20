var express = require('express');
var app= express();
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

});

//Controles
var controles=[];

controlNsp.on('connection',function(socket) {
  console.log('control conectado');
  
  //Cuando se presiona el boton en un control
  socket.on('boton', function emitirCoordenadas(coordenadas){
    console.log('cordenadas: '+coordenadas.x+' '+coordenadas.y);
    visorNsp.emit('dibujar',coordenadas);
    console.log('emitido dibujar');
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});