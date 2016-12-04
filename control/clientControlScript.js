var socket = io('/control');

var name;

$( document ).ready(function() {
  
  $('#connect').click(function conectar() {
    //Me conecto al server
    socket.connect('http://192.168.1.110:3000');
    //Le envio al servidor el nombre del jugador.
    name=$('#playerName').val();
    if(!name)
      name="default";
    socket.emit('playerName',name);
    $('#login').hide();
  });
  
  //Listener para tap de boton derecho
  var buttonRight = document.getElementById('buttonRight');
  var tapRight = new Hammer(buttonRight);
  // listen to events...
  tapRight.on("press", function() {
    socket.emit('pressRight',name); 
  });
  tapRight.on('pressup', function() {
    socket.emit('pressupRight',name);
  });
  
  //Listener para tap de boton izquierdo
  var tapLeft = new Hammer(document.getElementById('buttonLeft'));
  // listen to events...
  tapLeft.on("press", function() {
    socket.emit('pressLeft',name);
  });
  tapLeft.on('pressup', function() {
    socket.emit('pressupLeft',name);
  });
  
  var tapUp=new Hammer(document.getElementById('buttonUp'));
  
  tapUp.on('press',function() {
    socket.emit('pressUp',name);
  });
  
  tapUp.on('pressup',function() {
    socket.emit('pressupUp',name);
  });
  
});

