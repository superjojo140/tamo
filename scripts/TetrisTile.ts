class TetrisTile extends PIXI.Graphics {


    tileColor: number;
    borderColor: number;
    dimensions: number[][];


    constructor(dimensions: number[][], tileColor: number, borderColor: number) {
        super();
        this.dimensions = dimensions;
        this.tileColor = tileColor;
        this.borderColor = borderColor;

        if (!dimensions[0]) {
            throw "Cannot create empty TetrisTile";
        }
        //Draw itself
        for (let row = 0; row < dimensions.length; row++) {
            for (let column = 0; column < dimensions[0].length; column++) {
                if (this.dimensions[row][column] == 1) {

                    this.beginFill(this.tileColor);
                    this.lineStyle(2, this.borderColor);
                    let tw = TetrisContainer.TILE_WIDTH;
                    let th = TetrisContainer.TILE_HEIGHT;
                    this.drawRect(column * tw, row * th, tw, th);

                }
            }
        }
    }

    onBounce(container:TetrisContainer,ball:MovingSprite) {
        ball.vy *= -1;
        container.removeTetrisTile(this);
    }


}