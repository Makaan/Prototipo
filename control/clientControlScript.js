var socket = io('/control');



$( document ).ready(function() {
  
  socket.connect('http://192.168.0.100:3000');
  console.log('conectado '+(socket.connected));
  $('#boton').click(function() {
    var x=$('#x').val();
    var y=$('#y').val();
    $('#status').append('boton apretado, cord: '+x+' '+y+'<br>');
    socket.emit('boton',{'x':x,'y':y});
  });
});

