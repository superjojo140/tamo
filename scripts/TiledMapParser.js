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
                        var texture = spritesheet.getTexture(co.gid);
                        var sprite = new PIXI.Sprite(texture);
                        sprite.x = Math.round(co.x * SPRITE_SCALE.x);
                        sprite.y = (Math.round(co.y) - co.height) * SPRITE_SCALE.y; // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner
                        sprite.scale = SPRITE_SCALE;
                        container.addChild(sprite);
                        if (co.type == "character") {
                            map.player = new Player(sprite);
                            map.player.vx = 0;
                            map.player.vy = 0;
                        }
                    }
                }
                else {
                    if (tl.type == "tilelayer") {
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
