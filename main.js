class Main {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        this.gameState = "menu";

        this.level = "1.1";

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Moving camera further down rather than complete center
        this.cameraY = 180;

        this.player;
        this.block;
        this.levelFactory;
        this.level;
        this.drawText;
        this.soundHandler;

        this.levelBlocks = [];
        this.updatedLevelBlocks = [];
        this.levelTextArr = [];
        this.updatedLevelTextArr = [];

        this.rectangle;

        this.framerate = 20;

        this.loadGame();
    }

    loadGame() {
        this.soundHandler = new SoundHandler();
        this.player = new Player(this.canvas.width, this.canvas.height, this.cameraY, this.soundHandler);
        this.block = new Block();
        this.levelFactory = new LevelFactory();
        this.drawText = new DrawText();

        this.levelBlocks = this.levelFactory.createLevel(this.level)[0];
        this.levelTextArr = this.levelFactory.createLevel(this.level)[1];

        this.updatedLevelBlocks = this.updateBlockVariables(this.levelBlocks);
        this.updatedLevelTextArr = this.updateTextVariables(this.levelTextArr);

        this.level = new Level(this.block, this.drawText);
        this.rectangle = new Rectangle();


        // DOM Exception require user to interact before
        // sound can be played
        this.soundHandler.playSound("bg", undefined, true)

        this.update();

    }

    update() {
        var that = this;
        clearInterval(this.intervall);

        this.updatedLevelBlocks = this.updateBlockVariables(this.levelBlocks);
        this.updatedLevelTextArr = this.updateTextVariables(this.levelTextArr);

        this.player.update();

        this.playerCollision();

        this.draw();

        this.intervall = setInterval(function () {
            that.update();
        }, this.framerate);
    }

    playerCollision() {
        var didCollide = false;
        for (var block of this.levelBlocks) {
            var ob1 = [this.player.x, this.player.y, this.player.width, this.player.height];
            var ob2 = [block[0], block[1], block[2], block[3]];
            var blockType = block[4];
            //ob2 = this.updateBlockVariables(ob2);

            var em = 2; // Error margin
            var result = this.rectangle.intersectCheck(ob1, ob2, em);

            //console.log(result[0])

            // If a collision happened
            if (result[0]) {

                // Play different sound depending on collision block type
                this.collisionSound(this.soundHandler.getSoundFromBlock(blockType));


                didCollide = true;

                // If colliding with a spring
                if (blockType == "spring") {
                    this.player.velo_y = -Math.abs(this.player.velo_y * this.player.springFactor);
                    this.player.velo_x = (this.player.velo_x * this.player.springFactor)
                }
                /*                 this.player.velo_x = 0;
                                this.player.velo_y = 0; */

                //console.log(result[1][1])

                // If the player should fall or stay on/from block
                if (result[1][0] == "fall") {
                    if (result[1][1] == "left") {
                        this.player.x = block[0] - this.player.width - em;
                    }
                    else if (result[1][1] == "right") {
                        this.player.x = block[0] + block[2] + em * 2;
                    }
                    else if (result[1][1] == "down") {
                        this.player.y = block[1] + block[3] + em * 2;
                    }


                }
                else if (result[1][0] == "stay") {

                    // If the player is on top of a block
                    if (result[1][1] == "top") {

                        if (blockType == "block") {
                            var totY = this.player.y + this.player.height;

                            if (this.player.onBlock == false) {
                                if (totY > block[1]) {
                                    var diff = totY - block[1];
                                    this.player.y = block[1] - this.player.height - diff;
                                }
                            }
                            this.player.onBlock = true;
                        }
                    }
                }
            }
        }
        if (didCollide == false) {
            this.player.onBlock = false;
        }

    }

    updateBlockVariables(arr) {
        /*         var canvasX = (this.canvas.width / 2) - (arr[2] / 2);
                var canvasY = (this.canvas.height / 2) - (arr[3] / 2) + 200;
                arr[0] = arr[0] - this.player.x - canvasX;
                arr[1] = arr[1] - this.player.y - canvasY;
        
        
                var px = player.x; var py = player.y;
                var canvasX = (this.canvas.width / 2) - (w / 2);
                var canvasY = (this.canvas.height / 2) - (h / 2) + 200;
                
                x = x - px + canvasX;
                y = y - py + canvasY; */
        var canvasX = (this.canvas.width / 2) - (this.player.width / 2);
        var canvasY = (this.canvas.height / 2) - (this.player.height / 2) + this.cameraY;
        var newArr = [];

        for (var i = 0; i < arr.length; i++) {
            var blockArr = [];
            blockArr[0] = (arr[i][0] + canvasX) - this.player.x;
            blockArr[1] = (arr[i][1] + canvasY) - this.player.y;

            for (var j = 2; j < arr[i].length; j++) {
                blockArr[j] = arr[i][j];
            }

            newArr[i] = blockArr;
        }


        //console.log(arr)

        return newArr;
    }

    updateTextVariables(arr) {
        var newArr = [];

        for (var i = 0; i < arr.length; i++) {
            var textArr = [];

            var x = arr[i][0]; var y = arr[i][1]; var fs = arr[i][2];
            var text = this.drawText.getText(arr[i][3]);
            var textColor = arr[i][4];
            this.ctx.font = fs + "px Arial";
            var textLen = this.ctx.measureText(text).width;

            var tx = ((this.canvas.width / 2) - (textLen / 2) + x) - this.player.x;
            var ty = ((this.canvas.height / 2) + y) - this.player.y;

            //textArr[0] = tx; newArr[1] = ty; newArr[2] = fs; newArr[3] = text;
            textArr = [tx, ty, fs, text, textColor];
            newArr[i] = textArr;
        }

        return newArr;
    }

    collisionSound(sound) {
        if (sound !== false) {
            // Play bump sound
            if (sound == "bump") {
                if (this.player.velo_y > 0) {
                    var volume = (this.player.velo_y / this.player.max_velo_y) / 2;
                    this.soundHandler.playSound("bump", volume);
                    this.player.canPlayBumpSound = false;
                }
            }
            else {
                console.log(sound)
                this.soundHandler.playSound(sound, undefined);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ctx.beginPath();
        this.ctx.fillStyle = "#89BBFE";
        this.ctx.fill();
        this.ctx.fillRect(0, 0, 10000, 10000);

        this.ctx.closePath();

        this.level.draw(this.ctx, this.updatedLevelBlocks, this.updatedLevelTextArr);
        this.player.draw(this.ctx, this.canvas.width, this.canvas.height);
    }
}
