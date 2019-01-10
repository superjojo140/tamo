

class Map {

    player: Player;
    spritesheet: TiledSpritesheet;
    story: Story;
    pixiContainer: PIXI.Container;
    gameState: Object;
    collisionBitMap: boolean[][];
    finalTileWidth: number;
    finalTileHeight: number;
    eventTriggerMap: number[][];
    isPaused: boolean;

    destroy() {
        this.pixiContainer.destroy();
        return this.gameState;
    }

    keyDown(event) {
        this.player.keyDown(event);
    }

    keyUp(event) {
        this.player.keyUp(event);
    }

    doStep(delta) {
        if (!this.isPaused) {
            this.player.doStep(delta);
        }
    }

    pause(){
        this.isPaused = true;
    }

    play(){
        this.isPaused = false;
    }





}