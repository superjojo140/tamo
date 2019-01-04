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
var TetrisTile = /** @class */ (function (_super) {
    __extends(TetrisTile, _super);
    function TetrisTile(dimensions, tileColor, borderColor) {
        var _this = _super.call(this) || this;
        _this.dimensions = dimensions;
        _this.tileColor = tileColor;
        _this.borderColor = borderColor;
        if (!dimensions[0]) {
            throw "Cannot create empty TetrisTile";
        }
        //Draw itself
        for (var row = 0; row < dimensions.length; row++) {
            for (var column = 0; column < dimensions[0].length; column++) {
                if (_this.dimensions[row][column] == 1) {
                    _this.beginFill(_this.tileColor);
                    _this.lineStyle(2, _this.borderColor);
                    var tw = TetrisContainer.TILE_WIDTH;
                    var th = TetrisContainer.TILE_HEIGHT;
                    _this.drawRect(column * tw, row * th, tw, th);
                }
            }
        }
        return _this;
    }
    return TetrisTile;
}(PIXI.Graphics));
