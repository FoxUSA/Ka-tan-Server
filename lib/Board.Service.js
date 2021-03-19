const uuid = require('node-uuid');
const random = require('random-js')();

module.exports = {

  /**
     * Return factory
     * @return - object with an randomTileFactory.addResources and get randomTileFactory.getRandom
     */
  randomListItemFactory() {
    return {
      available: [],

      addResources(name, count) {
        for (let i = 0; i < count; i++) {
          this.available.push(name);
        }
      },

      /**
             * Get a random tile type
             * @return {TileType} - random tile type
             */
      getRandom() {
        const randomNumber = Math.floor(Math.random() * this.available.length);
        const tile = this.available.splice(randomNumber, 1)[0];
        return tile;
      },
    };
  },

  /**
     * Role two dice and add together. Must be two to match catan RNG
     * @return - number from 2 -12
     */
  diceRoll() {
    return random.integer(1, 6) + random.integer(1, 6);
  },

  /**
     * Create docks for board
     * @param {array} group - array to store docks in
     */
  createDocks(group = []) {
    const randomDock = this.randomListItemFactory();
    randomDock.addResources('Any', 4);
    randomDock.addResources('Wood', 1);
    randomDock.addResources('Rock', 1);
    randomDock.addResources('Sheep', 1);
    randomDock.addResources('Brick', 1);
    randomDock.addResources('Wheat', 1);

    const docks = [
      {
        x: 880, y: 400, angle: -210, boatX: 880, boatY: -100, boatAngle: 0, type: randomDock.getRandom(),
      },
      {
        x: 1090, y: 400, angle: 210, boatX: 1090, boatY: -100, boatAngle: 0, type: randomDock.getRandom(),
      },
      {
        x: 685, y: 515, angle: -210, boatX: -100, boatY: 515, boatAngle: 270, type: randomDock.getRandom(),
      },
      {
        x: 1195, y: 585, angle: -90, boatX: 2100, boatY: 585, boatAngle: 90, type: randomDock.getRandom(),
      },
      {
        x: 580, y: 700, angle: 90, boatX: -100, boatY: 700, boatAngle: 270, type: randomDock.getRandom(),
      },
      {
        x: 1195, y: 815, angle: -90, boatX: 2100, boatY: 815, boatAngle: 90, type: randomDock.getRandom(),
      },
      {
        x: 685, y: 885, angle: 30, boatX: -100, boatY: 885, boatAngle: 270, type: randomDock.getRandom(),
      },
      {
        x: 880, y: 1000, angle: 30, boatX: 880, boatY: 2000, boatAngle: 180, type: randomDock.getRandom(),
      },
      {
        x: 1090, y: 1000, angle: -30, boatX: 1090, boatY: 2000, boatAngle: 1, type: randomDock.getRandom(),
      },
    ];

    group.push(...docks);
  },

  /**
     * Create a random board
     * @param  {array} group - group of
     */
  createBoard(group = []) {
    const startX = 600;
    const startY = 400;
    const offsetX = 130;
    const offsetY = 115;
    const rows = [3, 4, 5, 4, 3];
    const rowsXOffset = [offsetX, offsetX / 2, 0, offsetX / 2, offsetX];
    const resources = 19;
    let count = 0;
    let row = 0;

    const randomTileFactory = this.randomListItemFactory();
    const randomNumberFactory = this.randomListItemFactory();
    randomNumberFactory.available = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

    randomTileFactory.addResources('brick', 3);
    randomTileFactory.addResources('sheep', 4);
    randomTileFactory.addResources('woods', 4);
    randomTileFactory.addResources('wheat', 4);
    randomTileFactory.addResources('rock', 3);
    randomTileFactory.addResources('desert', 1);

    for (let i = 0; i < resources; i++) {
      // New row?
      if (count === rows[row]) {
        count = 0;
        row++;
      }

      const x = startX + rowsXOffset[row] + count * offsetX;
      const y = startY + row * offsetY;

      // Create an actor with code.
      const tileType = randomTileFactory.getRandom();

      count++;
      group.push({
        x,
        y,
        tileType,
        diceNumber: tileType !== 'desert' ? randomNumberFactory.getRandom() : 0,
      });
    }
  },

  /**
     * Create pieces for players
     * @param  {map}          pieceGroup   [description]
     * @param  {number}       x            [description]
     * @param  {number}       y            [description]
     * @param  {number}       xOffset      [description]
     * @param  {number}       yOffset      [description]
     * @param  {number}       playerNumber [description]
     */
  createPiece(pieceGroup = {}, x, y, xOffset, yOffset, playerNumber) {
    let id;
    for (let i = 0; i < 5; i++) {
      id = uuid.v4();
      pieceGroup[id] = {
        x: x + random.integer(5, 30),
        y: y + random.integer(5, 30),
        spriteKey: 'town',
        playerNumber,
        id,
        angle: 0,
      };
    }

    for (let i = 0; i < 4; i++) {
      id = uuid.v4();
      pieceGroup[id] = {
        x: x + xOffset + random.integer(5, 30),
        y: y + yOffset + random.integer(5, 30),
        spriteKey: 'city',
        playerNumber,
        id,
        angle: 0,
      };
    }

    for (let i = 0; i < 15; i++) {
      id = uuid.v4();
      pieceGroup[id] = {
        x: x + (xOffset * 2.5) + random.integer(5, 30),
        y: y + (yOffset * 2.5) + random.integer(5, 30),
        spriteKey: 'road',
        playerNumber,
        id,
        angle: 0,
      };
    }
  },
};
