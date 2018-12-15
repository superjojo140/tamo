/// <reference path="./TiledSpritesheet.ts" />

class TiledMapParser {


  //Loads the map with spritesheet, story and gameState. Last parameter is callbackfunction which is called after parsinf the map with the new parsed map as parameter
  static loadMap(mapPath: string, spritesheet: TiledSpritesheet, storyPath: string, gameState: Object, callback: Function) {
    //Create Map
    let map: Map = new Map();
    map.pixiContainer = new PIXI.Container();
    //Load Spritesheet
    let SPRITE_SCALE: PIXI.Point = new PIXI.Point(3, 3);
    map.spritesheet = spritesheet;
    //Load Story and handle it

    //Load gameState
    map.gameState = gameState;
    //Load Map and Parse it
    $.getJSON(mapPath, {}, function (mapData) {
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
              map.player = new Player(x,y);
              container.addChild(map.player.sprite);
            }
            else {

              let texture = spritesheet.getTexture(co.gid);
              let sprite = new PIXI.Sprite(texture);
              
              sprite.scale = SPRITE_SCALE;
              container.addChild(sprite);
            }


          }

        } else {
          if (tl.type == "tilelayer") {
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
          } else //Layer is not of type "tilelayer"
            console.warn(`Ignoring Layer "${tl.name}". Layers of type "${tl.type}" are not supported yet.`);
        }
      }
      //Call onFinish Callback
      callback(map);
    });

  }

}


