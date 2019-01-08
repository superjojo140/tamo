/// <reference path="./TiledSpritesheet.ts" />
var TiledMapParser = /** @class */ (function () {
    function TiledMapParser() {
    }
    //Loads the map with spritesheet, story and gameState. Last parameter is callbackfunction which is called after parsinf the map with the new parsed map as parameter
    TiledMapParser.loadMap = function (mapPath, spritesheet, storyPath, gameState, callback) {
        //Create Map
        var map = new Map();
        map.pixiContainer = new PIXI.Container();
        //Load Spritesheet
        var SPRITE_SCALE = new PIXI.Point(3, 3);
        map.finalTileWidth = spritesheet.tileWidth * SPRITE_SCALE.x;
        map.finalTileHeight = spritesheet.tileHeight * SPRITE_SCALE.y;
        map.spritesheet = spritesheet;
        //Load Story and handle it
        //Load gameState
        map.gameState = gameState;
        //Load Map and Parse it
        $.getJSON(mapPath, {}, function (mapData) {
            //Iterate thorugh Tile Layers
            for (var layerIndex in mapData.layers) {
                var tl = mapData.layers[layerIndex];
                if (tl.type == "objectgroup") {
                    //Create new PIXI Container for this layer
                    var container = new PIXI.Container();
                    map.pixiContainer.addChild(container);
                    //Generate Sprites for each object to the container
                    for (var i in tl.objects) {
                        var co = tl.objects[i];
                        if (co.type == "character") {
                            var x = Math.round(co.x * SPRITE_SCALE.x);
                            var y = (Math.round(co.y) - co.height) * SPRITE_SCALE.y; // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner
                            map.player = new Player(x, y, map);
                            container.addChild(map.player.sprite);
                        }
                        else {
                            var texture = spritesheet.getTexture(co.gid);
                            var sprite = new PIXI.Sprite(texture);
                            sprite.scale = SPRITE_SCALE;
                            //an Object can be placed "between" tiles in tiled map editor. But evnts can be triggered only from whole tiles. So the obejccts position is mapped to the nearest Tile
                            var x = void 0;
                            var originalX = co.x * SPRITE_SCALE.x;
                            var diffToLeft = originalX % map.finalTileWidth;
                            if (diffToLeft < map.finalTileWidth / 2) {
                                x = originalX - diffToLeft; //Map to left Tile
                            }
                            else {
                                x = originalX - diffToLeft + map.finalTileWidth; //Map to right Tile
                            }
                            var y = void 0;
                            var originalY = (co.y - co.height) * SPRITE_SCALE.y; // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner              
                            var diffToTop = originalY % map.finalTileHeight;
                            if (diffToTop < map.finalTileHeight / 2) {
                                y = originalY - diffToTop; //Map to upper tile
                            }
                            else {
                                y = originalY - diffToTop + map.finalTileHeight; //Map to lower tile
                            }
                            sprite.x = x;
                            sprite.y = y;
                            container.addChild(sprite);
                        }
                    }
                }
                else {
                    if (tl.type == "tilelayer") {
                        //Check wether this is the collisionLayer
                        if (tl.name == "Collision" || tl.name == "collision") {
                            map.collisionBitMap = [];
                            //Generate Bitmap for Collisions. Any GID != 0 is interpreted as solid
                            for (var row = 0; row < tl.height; row++) {
                                map.collisionBitMap[row] = [];
                                for (var column = 0; column < tl.width; column++) {
                                    var index = row * tl.width + column;
                                    // gid != 0 means solid
                                    if (tl.data[index] != 0) {
                                        map.collisionBitMap[row][column] = true;
                                    }
                                    else {
                                        map.collisionBitMap[row][column] = false;
                                    }
                                }
                            }
                        }
                        else { //Not the collision layer
                            //}if(true){  //Draw the CollisionLayer - only for Debug
                            //Create new PIXI Container for this layer
                            var container = new PIXI.Container();
                            container.width = tl.width * spritesheet.tileWidth;
                            container.height = tl.height * spritesheet.tileHeight;
                            container.x = tl.x;
                            container.y = tl.y;
                            map.pixiContainer.addChild(container);
                            //Generate Sprites for each tile to the container
                            for (var row = 0; row < tl.height; row++) {
                                for (var column = 0; column < tl.width; column++) {
                                    var index = row * tl.width + column;
                                    if (tl.data[index] > 0) {
                                        var texture = spritesheet.getTexture(tl.data[index]);
                                        var sprite = new PIXI.Sprite(texture);
                                        sprite.x = column * spritesheet.tileWidth * SPRITE_SCALE.x;
                                        sprite.y = row * spritesheet.tileHeight * SPRITE_SCALE.y;
                                        sprite.scale = SPRITE_SCALE;
                                        container.addChild(sprite);
                                    }
                                }
                            }
                        }
                    }
                    else //Layer is not of type "tilelayer"
                        console.warn("Ignoring Layer \"" + tl.name + "\". Layers of type \"" + tl.type + "\" are not supported yet.");
                }
            }
            //Call onFinish Callback
            callback(map);
        });
    };
    return TiledMapParser;
}());
