var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
        bg.beginFill(0x8c3424);
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
        for (var rows = 0; rows < tile.dimensions.length; rows++) {
            for (var columns = 0; columns < tile.dimensions[0].length; columns++) {
                if (tile.dimensions[rows][columns] == 1) {
                    this.tilesArray[rows + y][columns + x];
                }
            }
        }
        tile.x = x * TetrisContainer.TILE_WIDTH;
        tile.y = y * TetrisContainer.TILE_HEIGHT;
        this.addChild(tile);
    };
    TetrisContainer.TILE_WIDTH = 32;
    TetrisContainer.TILE_HEIGHT = 32;
    return TetrisContainer;
}(PIXI.Container));
