var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var config = require("./config/config.js");
var boardService = require("./lib/Board.Service.js");

//Setup board
    var tiles = [];
    var pieces={};
    boardService.createBoard(tiles);
    boardService.createPiece(pieces, 800,275,100,0,0);
    boardService.createPiece(pieces, 800,1050,100,0,1);
    boardService.createPiece(pieces, 400,600,0,100,2);
    boardService.createPiece(pieces, 1300,600,0,100,3);

//Status page
    app.get("/", function(req, res){
        res.status(200)
                .json({version:config.version})
                .end();
    });

//Socket connections
    io.on("connection", function(socket){
        console.log("User connected");

        //Request full board update
            socket.on("requestInitBoardUpdate", function(data){
                //Send full board info
                socket.emit("initBoardUpdate", {
                    tiles:tiles,
                    pieces:pieces
                });
            });

        //Player piece is dragged
            socket.on("pieceUpdate", function(data){
                console.log("pieceUpdate received");
                pieces[data.id].x=data.x;
                pieces[data.id].y=data.y;
                socket.broadcast.emit("pieceUpdate", data);
            });
    });

http.listen(config.port, function(){
    console.log("listening on *:"+config.port);
});
