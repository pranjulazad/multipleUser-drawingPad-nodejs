var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connected = [];
users = [];

app.set('view engine', 'ejs');

app.get('/draw', function (req, res) {
    res.render('canvas');
});


io.sockets.on('connection', function (socket) {
    connected.push(socket);
    console.log('connected : %s clients connected', connected.length);

    socket.on('disconnect', function (data) {
        connected.splice(connected.indexOf(socket), 1);
        console.log('Disconnected : %s clients connected', connected.length);
    });

    socket.on('get down', function (x,y) {
       io.sockets.emit('drag',{X:x,Y:y});
    });

    socket.on('get up', function (x,y) {
        io.sockets.emit('drop',{X:x,Y:y});
    });

    socket.on('get move', function (x,y) {
        io.sockets.emit('move',{X:x,Y:y});
    });

});

server.listen(process.env.PORT || 3000,'0.0.0.0', function () {
    console.log('server is running at port 3000');
});
