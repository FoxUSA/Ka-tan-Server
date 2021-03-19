const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuid = require('node-uuid');
const config = require('./config/config.js');
const boardService = require('./lib/Board.Service.js');

const createRobber = (pieces, tile) => {
  const id = uuid.v4();
  pieces[id] = {
    x: tile.x,
    y: tile.y,
    spriteKey: 'robber',
    id,
    angle: 0,
  };
};

// Setup board
const tiles = [];
const pieces = {};
const docks = [];
boardService.createDocks(docks);
boardService.createBoard(tiles);
boardService.createPiece(pieces, 800, 240, 100, 0, 0);
boardService.createPiece(pieces, 800, 1150, 100, 0, 1);
boardService.createPiece(pieces, 400, 600, 0, 100, 2);
boardService.createPiece(pieces, 1350, 600, 0, 100, 3);

tiles.forEach((tile) => {
  if (tile.tileType === 'desert') {
    createRobber(pieces, tile);
  }
});

// Status page
app.get('/', (req, res) => {
  res.status(200)
    .json({ version: config.version })
    .end();
});

// Socket connections
io.on('connection', (socket) => {
  // Request full board update
  socket.on('requestInitBoardUpdate', () => {
    // Send full board info
    socket.emit('initBoardUpdate', {
      tiles,
      pieces,
      docks,
    });
  });

  // Roll
  socket.on('roll', () => {
    io.local.emit('roll', boardService.diceRoll());
  });

  // Player piece is dragged
  socket.on('pieceUpdate', (data) => {
    pieces[data.id].x = data.x;
    pieces[data.id].y = data.y;
    pieces[data.id].angle = data.angle;
    socket.broadcast.emit('pieceUpdate', data);
  });
});

http.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on *:${config.port}`);
});
