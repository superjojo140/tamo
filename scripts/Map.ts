

class Map{

    player : Player;
    spritesheet : TiledSpritesheet;
    story : Story;
    pixiContainer : PIXI.Container;
    gameState : Object;

    destroy(){
        this.pixiContainer.destroy();
        return this.gameState;
    }

    



}