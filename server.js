const express = require('express');
const server = express();
const PORT = process.env.PORT || 5001;

server.use(express.static(__dirname + '/public'));
server.set('port', PORT);

server.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(server.get('port'), () => {
    console.log("Server running at http://127.0.0.1:5001");
});
