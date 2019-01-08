

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

    destroy() {
        this.pixiContainer.destroy();
        return this.gameState;
    }





}