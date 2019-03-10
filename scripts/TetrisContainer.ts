class TetrisContainer extends PIXI.Container {
 
    


    static TILE_WIDTH: any = 32;
    static TILE_HEIGHT: any = 32;
    static TILES_V = 3;
    static TILES_H = 8;
    tiles_v: number;
    tiles_h: any;
    tilesArray: TetrisTile[][];



    constructor(tiles_h, tiles_v) {
        super();

        this.tiles_v = tiles_v;
        this.tiles_h = tiles_h;

        //Generate Backgroundshape
        let bg = new PIXI.Graphics;
        bg.beginFill(0xFFFFFF, 0.3);
        bg.drawRect(0, 0, this.tiles_h * TetrisContainer.TILE_WIDTH, this.tiles_v * TetrisContainer.TILE_HEIGHT);
        bg.endFill();
        this.addChild(bg);

        //Prepare Tilesarray
        this.tilesArray = [];
        for (let i = 0; i < this.tiles_v; i++) {
            this.tilesArray[i] = [];
        }
    }


    addTetrisTileAt(tile: TetrisTile, x: number, y: number) {

        if (tile.dimensions[0] == undefined) {
            throw "Cant add emtpy TetrisTile";
        }

        if (!this.isFitting(tile, x, y)) {
            throw "TetrisTile does not fit to Container";
        }

        for (let rows = 0; rows < tile.dimensions.length; rows++) {
            for (let columns = 0; columns < tile.dimensions[0].length; columns++) {
                if (tile.dimensions[rows][columns] == 1) {
                    this.tilesArray[rows + y][columns + x] = tile;
                }
            }
        }


        tile.x = x * TetrisContainer.TILE_WIDTH;
        tile.y = y * TetrisContainer.TILE_HEIGHT;
        this.addChild(tile);
    }

    removeTetrisTile(tile: TetrisTile) {
        for (let rows = 0; rows < this.tiles_v; rows++) {
            for (let columns = 0; columns < this.tiles_h; columns++) {
                if (this.tilesArray[rows][columns] == tile) {
                    this.tilesArray[rows][columns] = undefined;
                }
            }
        }
        this.removeChild(tile);
    }

    onBounce(ball: MovingSprite) {
        //calcuate bounced TetrisTile
        let deltaY = ball.y - this.y;
        deltaY /= TetrisContainer.TILE_HEIGHT;
        deltaY = Math.min(this.tiles_v - 1, Math.max(0, Math.floor(deltaY)));

        let deltaX = ball.x - this.x;
        deltaX /= TetrisContainer.TILE_WIDTH;
        deltaX = Math.min(this.tiles_h - 1, Math.max(0, Math.floor(deltaX)));

        let bouncedTile = this.tilesArray[deltaY][deltaX];
        if (bouncedTile) {
            bouncedTile.onBounce(this, ball);
        }
    }

    showGrid() {
        //Generate a container filling TetrisTile with transparent tiles and black borders
        let fullArray = []
        for (let rows = 0; rows < this.tiles_v; rows++) {
            fullArray[rows] = [];
            for (let columns = 0; columns < this.tiles_h; columns++) {
                fullArray[rows][columns] = 1;
            }
        }
        let tt = new TetrisTile(fullArray, 0xFFFFFF, 0x000000, 0);
        this.addChild(tt);
    }

    //Check wether tile is fitting into the container at position x,y relative to container's top-left corner
    isFitting(tile: TetrisTile, x: number, y: number) {
        for (let row = 0; row < tile.dimensions.length; row++) {
            for (let column = 0; column < tile.dimensions[row].length; column++) {
                if (this.tilesArray[row + y] == undefined || this.tilesArray[row + y][column + x] != undefined) {
                    //Does not fit at this tile
                    return false;
                }
            }
        }
        //If it was never returned false, return true
        return true;
    }

    static loadContainerByName(name: string): TetrisContainer {
        let containerData = GameManager.ressources.opponents[name];
        let tilesList = containerData.tetrisTiles;
        let container = new TetrisContainer(containerData.width,containerData.height);
        for(let i in tilesList){
            let tileData = tilesList[i];
            let tileName = tileData.name;
            let tile = TetrisTile.loadTileByName(tileName);
            container.addTetrisTileAt(tile,tileData.x,tileData.y);
        }
        return container;
    }

    isEmpty(): boolean {
        for(let row in this.tilesArray){
            for(let column in this.tilesArray[row])
            if(this.tilesArray[row][column]){
                return false;
            }
        }
        return true;
    }

}