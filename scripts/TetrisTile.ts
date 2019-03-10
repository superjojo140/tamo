class TetrisTile extends PIXI.Graphics {
   


    tileColor: number;
    borderColor: number;
    tileColorAlpha: number;
    dimensions: number[][];

    dragging: boolean;
    dragEventData;
    containerBuilder: ContainerBuilder;
    fitsAt: { x: number; y: number; };


    constructor(dimensions: number[][], tileColor: number, borderColor: number, tilecolorAlpha?: number) {
        super();
        if (tilecolorAlpha === undefined) {
            tilecolorAlpha = 1;
        };
        this.dimensions = dimensions;
        this.tileColor = tileColor;
        this.borderColor = borderColor;
        this.tileColorAlpha = tilecolorAlpha;
        this.dragging = false;

        if (!dimensions[0]) {
            throw "Cannot create empty TetrisTile";
        }
        //Draw itself
        for (let row = 0; row < dimensions.length; row++) {
            for (let column = 0; column < dimensions[0].length; column++) {
                if (this.dimensions[row][column] == 1) {

                    this.beginFill(this.tileColor, tilecolorAlpha);
                    this.lineStyle(2, this.borderColor);
                    let tw = TetrisContainer.TILE_WIDTH;
                    let th = TetrisContainer.TILE_HEIGHT;
                    this.drawRect(column * tw, row * th, tw, th);

                }
            }
        }
    }

    onBounce(container: TetrisContainer, ball: MovingSprite) {
        ball.vy *= -1;
        container.removeTetrisTile(this);
    }

    getCopy() {
        return new TetrisTile(this.dimensions, this.tileColor, this.borderColor, this.tileColorAlpha);
    }

    makeDraggable(cb: ContainerBuilder) {
        this.containerBuilder = cb;
        // enable the TetrisTile to be interactive... this will allow it to respond to mouse and touch events
        this.interactive = true;

        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        this.buttonMode = true;



        // setup events for mouse + touch using
        // the pointer events
        this
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);

    }

    onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.dragEventData = event.data;
        this.alpha = 0.8;
        this.dragging = true;
    }

    onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.dragEventData = null;
        if (this.fitsAt) {
            this.containerBuilder.tetrisContainer.addTetrisTileAt(this.getCopy(), this.fitsAt.x, this.fitsAt.y);
        }
        this.containerBuilder.removeChild(this);
        this.destroy();
    }

    onDragMove() {

        if (this.dragging) {

            var newPosition = this.dragEventData.getLocalPosition(this.parent);

            //Check wether tile is over Tetriscontainer
            let c = this.containerBuilder.tetrisContainer;
            if (newPosition.y < c.y + c.height && newPosition.y > c.y && newPosition.x < c.x + c.width && newPosition.x > c.x) {
                //Map to tiles
                let xTile = Math.floor((newPosition.x - c.x) / (TetrisContainer.TILE_WIDTH * c.scale.x));
                let yTile = Math.floor((newPosition.y - c.y) / (TetrisContainer.TILE_HEIGHT * c.scale.y));


                if (c.isFitting(this, xTile, yTile)) {
                    this.tint = 0x00FF00; //Green 
                    this.fitsAt = { x: xTile, y: yTile };
                }
                else {
                    this.tint = 0xFF0000; //Red
                    this.fitsAt = undefined;
                }

                //Snap to tile
                this.x = xTile * TetrisContainer.TILE_WIDTH * c.scale.x + c.x;
                this.y = yTile * TetrisContainer.TILE_HEIGHT * c.scale.y + c.y;

            }
            else {

                //Move free by cursor
                this.x = newPosition.x;
                this.y = newPosition.y;
                this.fitsAt = undefined;
            }
        }
    }

    isShelfTile(cb: ContainerBuilder) {
        this.containerBuilder = cb;
        // enable the TetrisTile to be interactive... this will allow it to respond to mouse and touch events
        this.interactive = true;
        // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        this.buttonMode = true;



        // setup events for mouse + touch using
        // the pointer events
        this.on('pointerdown', this.createDraggableCopy);

    }

    createDraggableCopy(event) {
        let newTile = this.getCopy();
        newTile.makeDraggable(this.containerBuilder);
        newTile.scale = this.containerBuilder.scaleFactor;
        this.containerBuilder.addChild(newTile);
        newTile.onDragStart(event);
        newTile.onDragMove();
    }

    static loadTileByName(tileName: string): TetrisTile {
        let tile = GameManager.ressources.tetrisTiles[tileName];
        return new TetrisTile(tile.dimensions, tile.tileColor, tile.borderColor);
    }



}