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

    socket.on('get down', function (x,y,c,s) {
       io.sockets.emit('drag',{X:x,Y:y,C:c,S:s});
    });

    socket.on('get up', function () {
        io.sockets.emit('drop');
    });

    socket.on('get move', function (x,y,c,s) {
        io.sockets.emit('move',{X:x,Y:y,C:c,S:s});
    });

});

server.listen(process.env.PORT || 3000,'0.0.0.0', function () {
    console.log('server is running at port 3000');
});
