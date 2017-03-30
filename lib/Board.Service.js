var uuid = require("node-uuid");
module.exports={
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

            var availableTiles = [];
            var availableTileNumbers= [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];

            var count = 0;
            var row = 0;

            /**
             * Small helper function to
             * @param string - name - Name to add to array
             * @param number - count - Number of time to add to array
             */
            var addResources = function(name,count){
                for(var i = 0; i<count;i++)
                    availableTiles.push(name);
            };

            addResources("brick",3);
            addResources("sheep",4);
            addResources("woods",4);
            addResources("wheat",4);
            addResources("rock",3);
            addResources("desert",1);

            /**
             * Get a random tile type
             * @return {TileType} - random tile type
             */
            var getRandomResource = function(){
                var tileNumber = Math.floor(Math.random() * availableTiles.length);
                var tile = availableTiles.splice(tileNumber,1)[0];
                return tile;
            };

            /**
             * Get a random tile number
             * @return {number} - random tile number
             */
            var getRandomTileNumber = function(){
                var i = Math.floor(Math.random() * availableTileNumbers.length);
                var tileNumber = availableTileNumbers.splice(i,1)[0];
                return tileNumber;
            };

            for (var i = 0; i < resources; i++) {
                // New row?
                    if (count == rows[row]) {
                        count = 0;
                        row++;
                    }

                var x = startX+rowsXOffset[row]+(count*offsetX);
                var y = startY+row*offsetY;

                // Create an actor with code.
                    var tileType = getRandomResource();

                    count++;
                    group.push({x:x,
                                y:y,
                                tileType:tileType,
                                diceNumber:tileType!="desert"?getRandomTileNumber():0
                    });
            }
    },

    /**
     * Return a number between provided max and min
     * @param  {[type]} min [description]
     * @param  {[type]} max [description]
     * @return - a integer
     */
    integerInRange:function(min,max){
        return Math.floor(Math.random() * max) + min;
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
                x:x+this.integerInRange(5, 30),
                y:y+this.integerInRange(5, 30),
                spriteKey: "town",
                playerNumber:playerNumber,
                id: id
            };
        }

        for(i = 0;i<4;i++){//TODO 4
            id = uuid.v4();
            pieceGroup[id]={
                x:x+xOffset+this.integerInRange(5, 30),
                y:y+yOffset+this.integerInRange(5, 30),
                spriteKey: "city",
                playerNumber:playerNumber,
                id: id
            };
        }
    }
};
