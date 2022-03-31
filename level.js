class Level {
    constructor(blockObj, textObj) {
        this.blockObj = blockObj;
        this.textObj = textObj;
    }

    draw(ctx, blocks, textArr) {
        for (var block of blocks) {
            this.blockObj.draw(ctx, block);
        }

        for (var text of textArr) {
            this.textObj.draw(ctx, text);
        }
    }
}