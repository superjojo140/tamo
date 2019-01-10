var Map = /** @class */ (function () {
    function Map() {
    }
    Map.prototype.destroy = function () {
        this.pixiContainer.destroy();
        return this.gameState;
    };
    Map.prototype.keyDown = function (event) {
        if (!this.isPaused) {
            this.player.keyDown(event);
        }
    };
    Map.prototype.keyUp = function (event) {
        this.player.keyUp(event);
    };
    Map.prototype.doStep = function (delta) {
        if (!this.isPaused) {
            this.player.doStep(delta);
        }
    };
    Map.prototype.pause = function () {
        this.isPaused = true;
    };
    Map.prototype.play = function () {
        this.isPaused = false;
    };
    return Map;
}());
