var uuid = require("node-uuid");
var random = require("random-js")();
module.exports={

    /**
     * Return factory
     * @return - object with an randomTileFactory.addResources and get randomTileFactory.getRandom
     */
    randomListItemFactory:function(){
        return {
            available:[],
            addResources:function(name,count){
                for(var i = 0; i<count;i++)
                    this.available.push(name);
            },

            /**
             * Get a random tile type
             * @return {TileType} - random tile type
             */
            getRandom:function(){
                var randomNumber = Math.floor(Math.random() * this.available.length);
                var tile = this.available.splice(randomNumber,1)[0];
                return tile;
            }
        };
    },

    /**
     * Role two dice and add together. Must be two to match catan RNG
     * @return - number from 2 -12
     */
    diceRoll:function(){
        return random.integer(1, 6)+random.integer(1, 6);
    },


    /**
     * Create docks for board
     * @param  {array} group - array to store docks in
     */
    creatDocks: function(group){
        group = group ||[];
        var randomDock = this.randomListItemFactory();
        randomDock.addResources("Any",4);
        randomDock.addResources("Wood",1);
        randomDock.addResources("Rock",1);
        randomDock.addResources("Sheep",1);
        randomDock.addResources("Brick",1);
        randomDock.addResources("Wheat",1);

        var docks = [
            {x:880,y:400,angle:-210},
            {x:1090,y:400,angle:210},
            {x:685,y:515,angle:-210},
            {x:1195,y:585,angle:-90},
            {x:580,y:700,angle:90},
            {x:1195,y:815,angle:-90},
            {x:685,y:885,angle:30},
            {x:880,y:1000,angle:30},
            {x:1090,y:1000,angle:-30}
        ];

        docks.forEach(function(dock){
            dock.type = randomDock.getRandom();
            group.push(dock);
        });

    },

    /**
     * Create a random board
     * @param  {array} group   - group of
     */
    createBoard:function(group){
        group = group ||[];
        //Setup board
            var startX = 600;
            var startY = 400;

            var offsetX = 130;
            var offsetY = 115;
            var rows = [3, 4, 5, 4, 3];
            var rowsXOffset = [offsetX, offsetX / 2, 0, offsetX / 2, offsetX];
            var resources = 19;

            var count = 0;
            var row = 0;

            var randomTileFactory = this.randomListItemFactory();
            var randomNumberFactory = this.randomListItemFactory();
            randomNumberFactory.available=[2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];

            randomTileFactory.addResources("brick",3);
            randomTileFactory.addResources("sheep",4);
            randomTileFactory.addResources("woods",4);
            randomTileFactory.addResources("wheat",4);
            randomTileFactory.addResources("rock",3);
            randomTileFactory.addResources("desert",1);

            for (var i = 0; i < resources; i++) {
                // New row?
                    if (count == rows[row]) {
                        count = 0;
                        row++;
                    }

                var x = startX+rowsXOffset[row]+(count*offsetX);
                var y = startY+row*offsetY;

                // Create an actor with code.
                    var tileType = randomTileFactory.getRandom();

                    count++;
                    group.push({x:x,
                                y:y,
                                tileType:tileType,
                                diceNumber:tileType!="desert"?randomNumberFactory.getRandom():0
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
    createPiece:function(pieceGroup, x,y,xOffset,yOffset,playerNumber){
        pieceGroup=pieceGroup||{};
        var id;
        for(var i = 0;i<5;i++){
            id = uuid.v4();
            pieceGroup[id]={
                x:x+random.integer(5, 30),
                y:y+random.integer(5, 30),
                spriteKey: "town",
                playerNumber:playerNumber,
                id: id,
                angle:0
            };
        }

        for(i = 0;i<4;i++){
            id = uuid.v4();
            pieceGroup[id]={
                x:x+xOffset+random.integer(5, 30),
                y:y+yOffset+random.integer(5, 30),
                spriteKey: "city",
                playerNumber:playerNumber,
                id: id,
                angle:0
            };
        }

        for(i = 0;i<15;i++){
            id = uuid.v4();
            pieceGroup[id]={
                x:x+(xOffset*2.5)+random.integer(5, 30),
                y:y+(yOffset*2.5)+random.integer(5, 30),
                spriteKey: "road",
                playerNumber:playerNumber,
                id: id,
                angle:0
            };
        }
    }
};
