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
var MovingSprite = /** @class */ (function (_super) {
    __extends(MovingSprite, _super);
    function MovingSprite(texture) {
        var _this = _super.call(this, texture) || this;
        _this.vx = 0;
        _this.vy = 0;
        _this.speed = 0;
        return _this;
    }
    return MovingSprite;
}(PIXI.Sprite));
