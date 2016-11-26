var socket = io('/control');



$( document ).ready(function() {
  
  $('#conectar').click(function conectar() {
    //Me conecto al server
    socket.connect('http://10.3.184.216:3000');
    //Le envio al servidor el nombre del jugador.
    console.log($('#nombre').val());
    socket.emit('nombre',$('#nombre').val());
  });
  
  $('#botonArriba').click(function botonArriba() {
    socket.emit('botonArriba');
  });
  
  $('#botonDerecha').mousedown(function botonArriba() {
    socket.emit('mousedown');
  });
  
   $('#botonDerecha').mouseup(function botonArriba() {
    socket.emit('mouseup');
  });
  
  $('#botonAbajo').click(function botonArriba() {
    socket.emit('botonAbajo');
  });
  
  $('#botonIzquierda').click(function botonArriba() {
    socket.emit('botonIzquierda');
  });
  //Listener para tap de boton derecho
  var botonDerecha = document.getElementById('botonDerecha');
  var tapDerecha = new Hammer(botonDerecha);
  // listen to events...
  tapDerecha.on("press", function() {
      console.log('press R');
      socket.emit('pressDerecha');
      
  });
  tapDerecha.on('pressup', function() {
    console.log('pressup R');
    socket.emit('pressupDerecha');
  });
  
  //Listener para tap de boton izquierdo
  var tapIzquierda = new Hammer(document.getElementById('botonIzquierda'));
  // listen to events...
  tapIzquierda.on("press", function() {
      console.log('press L');
      socket.emit('pressIzquierda');
      
  });
  tapIzquierda.on('pressup', function() {
    console.log('pressup L');
    socket.emit('pressupIzquierda');
  });
  
  var tapArriba=new Hammer(document.getElementById('botonArriba'));
  tapArriba.on('tap',function() {
    socket.emit('botonArriba');
  });
});

