
// Make connection
var url = location.href;
// var socket = io.connect(url.substring(0, url.indexOf('/', 8)>1 ? url.indexOf('/', 8):url.length()));
var socket = io.connect("http://localhost:4000");

var broadcasting = document.getElementById('start-broadcasting');

// Emit events
broadcasting.addEventListener('click', function(){
    
    console.log("URL: ",location.href);

  socket.emit('broadcast', {
    broadcast_link: location.href
  });
});

