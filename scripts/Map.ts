

class Map {

    player: Player;
    spritesheet: TiledSpritesheet;
    pixiContainer: PIXI.Container;
    collisionBitMap: boolean[][];
    finalTileWidth: number;
    finalTileHeight: number;
    eventTriggerMap: {visible:boolean,event:number,sprite:PIXI.Sprite, name:string}[][];
    isPaused: boolean;

    destroy() {
        this.pixiContainer.destroy();
    }

    keyDown(event) {
        if (!this.isPaused) {
            this.player.keyDown(event);
        }
    }

    keyUp(event) {
        this.player.keyUp(event);
    }

    doStep(delta) {
        if (!this.isPaused) {
            this.player.doStep(delta);
        }
    }

    pause() {
        this.isPaused = true;
    }

    play() {
        this.isPaused = false;
    }





}