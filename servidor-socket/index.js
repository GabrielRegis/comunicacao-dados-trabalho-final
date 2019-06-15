var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {

    socket.on('entrouNaSala', (data) => {
        console.log(data)
        io.emit('usuarioConectado', data)
    })

    socket.on('enviarMensagem', (data) => {
        console.log(data)
        io.emit('mensagemChegou', data);
    });
});

http.listen(3000, function () {
    console.log('Servidor rodando em: http://localhost:3000');
});