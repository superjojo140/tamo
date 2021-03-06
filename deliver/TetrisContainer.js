var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TetrisContainer = /** @class */ (function (_super) {
    __extends(TetrisContainer, _super);
    function TetrisContainer(tiles_h, tiles_v) {
        var _this = _super.call(this) || this;
        _this.tiles_v = tiles_v;
        _this.tiles_h = tiles_h;
        //Generate Backgroundshape
        var bg = new PIXI.Graphics;
        bg.beginFill(0xFFFFFF, 0.3);
        bg.drawRect(0, 0, _this.tiles_h * TetrisContainer.TILE_WIDTH, _this.tiles_v * TetrisContainer.TILE_HEIGHT);
        bg.endFill();
        _this.addChild(bg);
        //Prepare Tilesarray
        _this.tilesArray = [];
        for (var i = 0; i < _this.tiles_v; i++) {
            _this.tilesArray[i] = [];
        }
        return _this;
    }
    TetrisContainer.prototype.addTetrisTileAt = function (tile, x, y) {
        if (tile.dimensions[0] == undefined) {
            throw "Cant add emtpy TetrisTile";
        }
        if (!this.isFitting(tile, x, y)) {
            throw "TetrisTile does not fit to Container";
        }
        for (var rows = 0; rows < tile.dimensions.length; rows++) {
            for (var columns = 0; columns < tile.dimensions[0].length; columns++) {
                if (tile.dimensions[rows][columns] == 1) {
                    this.tilesArray[rows + y][columns + x] = tile;
                }
            }
        }
        tile.x = x * TetrisContainer.TILE_WIDTH;
        tile.y = y * TetrisContainer.TILE_HEIGHT;
        this.addChild(tile);
    };
    TetrisContainer.prototype.removeTetrisTile = function (tile) {
        for (var rows = 0; rows < this.tiles_v; rows++) {
            for (var columns = 0; columns < this.tiles_h; columns++) {
                if (this.tilesArray[rows][columns] == tile) {
                    this.tilesArray[rows][columns] = undefined;
                }
            }
        }
        this.removeChild(tile);
    };
    TetrisContainer.prototype.onBounce = function (ball) {
        //calcuate bounced TetrisTile
        var deltaY = ball.y - this.y;
        deltaY /= TetrisContainer.TILE_HEIGHT;
        deltaY = Math.min(this.tiles_v - 1, Math.max(0, Math.floor(deltaY)));
        var deltaX = ball.x - this.x;
        deltaX /= TetrisContainer.TILE_WIDTH;
        deltaX = Math.min(this.tiles_h - 1, Math.max(0, Math.floor(deltaX)));
        var bouncedTile = this.tilesArray[deltaY][deltaX];
        if (bouncedTile) {
            bouncedTile.onBounce(this, ball);
        }
    };
    TetrisContainer.prototype.showGrid = function () {
        //Generate a container filling TetrisTile with transparent tiles and black borders
        var fullArray = [];
        for (var rows = 0; rows < this.tiles_v; rows++) {
            fullArray[rows] = [];
            for (var columns = 0; columns < this.tiles_h; columns++) {
                fullArray[rows][columns] = 1;
            }
        }
        var tt = new TetrisTile(fullArray, 0xFFFFFF, 0x000000, 0);
        this.addChild(tt);
    };
    //Check wether tile is fitting into the container at position x,y relative to container's top-left corner
    TetrisContainer.prototype.isFitting = function (tile, x, y) {
        for (var row = 0; row < tile.dimensions.length; row++) {
            for (var column = 0; column < tile.dimensions[row].length; column++) {
                if (this.tilesArray[row + y] == undefined || this.tilesArray[row + y][column + x] != undefined) {
                    //Does not fit at this tile
                    return false;
                }
            }
        }
        //If it was never returned false, return true
        return true;
    };
    TetrisContainer.loadContainerByName = function (name) {
        var containerData = GameManager.ressources.opponents[name];
        var tilesList = containerData.tetrisTiles;
        var container = new TetrisContainer(containerData.width, containerData.height);
        for (var i in tilesList) {
            var tileData = tilesList[i];
            var tileName = tileData.name;
            var tile = TetrisTile.loadTileByName(tileName);
            container.addTetrisTileAt(tile, tileData.x, tileData.y);
        }
        return container;
    };
    TetrisContainer.prototype.isEmpty = function () {
        for (var row in this.tilesArray) {
            for (var column in this.tilesArray[row])
                if (this.tilesArray[row][column]) {
                    return false;
                }
        }
        return true;
    };
    TetrisContainer.TILE_WIDTH = 32;
    TetrisContainer.TILE_HEIGHT = 32;
    TetrisContainer.TILES_V = 3;
    TetrisContainer.TILES_H = 8;
    return TetrisContainer;
}(PIXI.Container));
