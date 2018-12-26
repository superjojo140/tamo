var Map = /** @class */ (function () {
    function Map() {
    }
    Map.prototype.destroy = function () {
        this.pixiContainer.destroy();
        return this.gameState;
    };
    return Map;
}());
