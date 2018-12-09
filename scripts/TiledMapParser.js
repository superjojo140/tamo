class TiledMapParser {


  constructor(container, spritesheet, mapPath, callback) {
    this.SPRITE_SCALE = new PIXI.Point(3, 3);
    this.spritesheet = spritesheet;
    this.bigTexture = PIXI.Texture.fromImage(this.spritesheet.path, true, PIXI.SCALE_MODES.NEAREST);
    this.textures = [];
    this.pixiContainer = container;
    this.onFinish = callback;
    this.loadMap(mapPath);
  }

  getTexture(gid) {
    //Check wether textures was allready framed form spritesheet
    if (this.textures[gid]) {
      return this.textures[gid];
    } else {
      //Calculate row and column from gid
      let row = Math.floor((gid - 1) / this.spritesheet.columns);
      let column = (gid - 1) % this.spritesheet.columns;

      var tileWidth = this.spritesheet.tileWidth;
      var tileHeight = this.spritesheet.tileHeight;

      let x = column * tileWidth + column * this.spritesheet.border;
      let y = row * tileHeight + row * this.spritesheet.border;

      let t = new PIXI.Texture(this.bigTexture, new PIXI.Rectangle(x, y, tileWidth, tileHeight));
      //Save Texture in cache array
      this.textures[gid] = t;
      return t;
    }
  }

  loadMap(path) {
    let parser = this;
    $.getJSON(path, {}, function (map) {
      //Bind map to parser object
      parser.map = map;
      //Iterate thorugh Tile Layers
      for (let layerIndex in map.layers) {
        let tl = map.layers[layerIndex];
        
        if (tl.type == "objectgroup") {
          //Create new PIXI Container for this layer
          let container = new PIXI.Container();
          parser.pixiContainer.addChild(container);

          //Generate Sprites for each object to the container
          for (let i in tl.objects) {

            var co = tl.objects[i];
            let texture = parser.getTexture(co.gid);
            let sprite = new PIXI.Sprite(texture);
            sprite.x = Math.round(co.x * parser.SPRITE_SCALE.x);
            sprite.y = (Math.round(co.y) - co.height) * parser.SPRITE_SCALE.y; // -co.height because tiled uses the bottom-left corner for coordinates and PIXI uses the top-left corner
            sprite.scale = parser.SPRITE_SCALE;
            container.addChild(sprite);
            
            if(co.type == "character"){
              parser.player = sprite;
              parser.player.vx = 0;
              parser.player.vy = 0;
            }
          }

        } else {
          if (tl.type == "tilelayer") {
            //Create new PIXI Container for this layer
            let container = new PIXI.Container();
            container.width = tl.width * parser.spritesheet.tileWidth;
            container.height = tl.height * parser.spritesheet.tileHeight;
            container.x = tl.x;
            container.y = tl.y;
            parser.pixiContainer.addChild(container);

            //Generate Sprites for each tile to the container
            for (let row = 0; row < tl.height; row++) {
              for (let column = 0; column < tl.width; column++) {
                let index = row * tl.width + column;
                if (tl.data[index] > 0) {
                  let texture = parser.getTexture(tl.data[index]);
                  let sprite = new PIXI.Sprite(texture);
                  sprite.x = column * parser.spritesheet.tileWidth * parser.SPRITE_SCALE.x;
                  sprite.y = row * parser.spritesheet.tileHeight * parser.SPRITE_SCALE.y;
                  sprite.scale = parser.SPRITE_SCALE;
                  container.addChild(sprite);
                }
              }
            }
          } else //Layer is not of type "tilelayer"
            console.warn(`Ignoring Layer "${tl.name}". Layers of type "${tl.type}" are not supported yet.`);
        }
      }
      //Call onFinish Callback
      parser.onFinish();
    });

  }







}
