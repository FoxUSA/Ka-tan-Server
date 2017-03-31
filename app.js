var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var config = require("./config/config.js");
var boardService = require("./lib/Board.Service.js");
var uuid = require("node-uuid");

var createRobber = function(pieces,tile){
    var id = uuid.v4();
    pieces[id]={
        x:tile.x,
        y:tile.y,
        spriteKey: "robber",
        id: id,
        angle:0
    };
};

//Setup board
    var tiles = [];
    var pieces={};
    var docks = [];
    boardService.creatDocks(docks);
    boardService.createBoard(tiles);
    boardService.createPiece(pieces, 800,240,100,0,0);
    boardService.createPiece(pieces, 800,1100,100,0,1);
    boardService.createPiece(pieces, 400,600,0,100,2);
    boardService.createPiece(pieces, 1300,600,0,100,3);


    tiles.filter(function(tile){
        if(tile.tileType=="desert")
            createRobber(pieces,tile);
    });

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
            socket.on("requestInitBoardUpdate", function(){
                //Send full board info
                socket.emit("initBoardUpdate", {
                    tiles:tiles,
                    pieces:pieces,
                    docks:docks
                });
            });

        //Roll
            socket.on("roll", function(){
                io.local.emit("roll", boardService.diceRoll());
            });

        //Player piece is dragged
            socket.on("pieceUpdate", function(data){
                console.log("pieceUpdate received");
                pieces[data.id].x=data.x;
                pieces[data.id].y=data.y;
                pieces[data.id].angle=data.angle;
                socket.broadcast.emit("pieceUpdate", data);
            });
    });

http.listen(config.port, function(){
    console.log("listening on *:"+config.port);
});
