/// <reference path="./TiledSpritesheet.ts" />

class TiledMapParser {


  //Loads the map with spritesheet, story and gameState. Last parameter is callbackfunction which is called after parsinf the map with the new parsed map as parameter
  static loadMap(mapPath: string, spritesheet: TiledSpritesheet, storyPath: string, gameState: Object, callback: Function) {
    //Create Map
    let map: Map = new Map();
    map.pixiContainer = new PIXI.Container();
    //Load Spritesheet
    let SPRITE_SCALE: PIXI.Point = new PIXI.Point(4, 4);
    map.finalTileWidth = spritesheet.tileWidth * SPRITE_SCALE.x;
    map.finalTileHeight = spritesheet.tileHeight * SPRITE_SCALE.y;
    map.spritesheet = spritesheet;
    //Load Map and Parse it
    $.getJSON(mapPath, {}, function (mapData) {

      //Create eventTriggerMap
      map.eventTriggerMap = [];
      for (let i = 0; i < mapData.width; i++) {
        map.eventTriggerMap[i] = [];
      }


      //Iterate thorugh Tile Layers
      for (let layerIndex in mapData.layers) {
        let tl = mapData.layers[layerIndex];

        if (tl.type == "objectgroup") {
          //Create new PIXI Container for this layer
          let container = new PIXI.Container();
          map.pixiContainer.addChild(container);

          //Generate Sprites for each object to the container
          for (let i in tl.objects) {

            let co = tl.objects[i];

            if (co.type == "character") {
              let x = Math.round(co.x * SPRITE_SCALE.x);
              let y = (Math.round(co.y) - co.height) * SPRITE_SCALE.y; // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner
              map.player = new Player(x, y, map);
              container.addChild(map.player.sprite);
            }
            else {

              let texture = spritesheet.getTexture(co.gid);
              let sprite = new PIXI.Sprite(texture);
              sprite.scale = SPRITE_SCALE;

              //an Object can be placed "between" tiles in tiled map editor. But evnts can be triggered only from whole tiles. So the obejccts position is mapped to the nearest Tile

              let originalX = co.x * SPRITE_SCALE.x;
              let xTiles = originalX / map.finalTileWidth;
              xTiles = Math.round(xTiles);

              let originalY = (co.y - co.height) * SPRITE_SCALE.y;  // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner              
              let yTiles = originalY / map.finalTileHeight;
              yTiles = Math.round(yTiles);

              //Set sprites coordinates
              sprite.x = xTiles * map.finalTileWidth;
              sprite.y = yTiles * map.finalTileHeight;

              //Set sprites visibility
              sprite.visible = co.visible;

              //generate object for eventTriggerMap
              let eventObject = { sprite: sprite, visible: co.visible, event:undefined , name:co.name};

              //set event id in maps eventMap
              if (co.properties) {
                for (let i in co.properties) {
                  if (co.properties[i].name == "event") {
                     eventObject.event = co.properties[i].value;
                  }
                }
              }

              map.eventTriggerMap[yTiles][xTiles] = eventObject;

              container.addChild(sprite);
            }


          }

        } else {
          if (tl.type == "tilelayer") {

            //Check wether this is the collisionLayer
            if (tl.name == "Collision" || tl.name == "collision") {
              map.collisionBitMap = [];
              //Generate Bitmap for Collisions. Any GID != 0 is interpreted as solid
              for (let row = 0; row < tl.height; row++) {
                map.collisionBitMap[row] = [];
                for (let column = 0; column < tl.width; column++) {
                  let index = row * tl.width + column;
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
              let container = new PIXI.Container();
              container.width = tl.width * spritesheet.tileWidth;
              container.height = tl.height * spritesheet.tileHeight;
              container.x = tl.x;
              container.y = tl.y;
              map.pixiContainer.addChild(container);

              //Generate Sprites for each tile to the container
              for (let row = 0; row < tl.height; row++) {
                for (let column = 0; column < tl.width; column++) {
                  let index = row * tl.width + column;
                  if (tl.data[index] > 0) {
                    let texture = spritesheet.getTexture(tl.data[index]);
                    let sprite = new PIXI.Sprite(texture);
                    sprite.x = column * spritesheet.tileWidth * SPRITE_SCALE.x;
                    sprite.y = row * spritesheet.tileHeight * SPRITE_SCALE.y;
                    sprite.scale = SPRITE_SCALE;
                    container.addChild(sprite);
                  }
                }
              }
            }
          } else //Layer is not of type "tilelayer"
            console.warn(`Ignoring Layer "${tl.name}". Layers of type "${tl.type}" are not supported yet.`);
        }
      }
      //play Map
      map.play();

      //Call onFinish Callback
      callback(map);
    });

  }

}


