var socket = io('/control');

var name;

$( document ).ready(function() {
  
  $('#conectar').click(function conectar() {
    //Me conecto al server
    socket.connect('http://10.3.184.216:3000');
    //Le envio al servidor el nombre del jugador.
    
    name=$('#nombre').val();
    if(!name)
      name="default";
    socket.emit('nombre',name);
    $('#name').hide();
  });
  
  //Listener para tap de boton derecho
  var botonDerecha = document.getElementById('botonDerecha');
  var tapDerecha = new Hammer(botonDerecha);
  // listen to events...
  tapDerecha.on("press", function() {
    socket.emit('pressDerecha',name); 
  });
  tapDerecha.on('pressup', function() {
    socket.emit('pressupDerecha',name);
  });
  
  //Listener para tap de boton izquierdo
  var tapIzquierda = new Hammer(document.getElementById('botonIzquierda'));
  // listen to events...
  tapIzquierda.on("press", function() {
    socket.emit('pressIzquierda',name);
  });
  tapIzquierda.on('pressup', function() {
    socket.emit('pressupIzquierda',name);
  });
  
  var tapArriba=new Hammer(document.getElementById('botonArriba'));
  
  tapArriba.on('press',function() {
    socket.emit('pressArriba',name);
  });
  
  tapArriba.on('pressup',function() {
    socket.emit('pressupArriba',name);
  });
  
});

