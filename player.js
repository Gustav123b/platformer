class Player {
    constructor(canvasW, canvasH, cameraY, soundHandler) {
        this.width = 64;
        this.height = 64;
        this.playerRotate = 5;

        this.circleR = 35;
        this.circleAng = 0;
        this.circleI = 0;
        this.circleRotateSpd = 4.5;

        this.velo_x = 1;
        this.velo_y = 1;
        this.max_velo_x;
        this.max_velo_y = 35;
        this.grav = 1.1;
        this.fric_y = 0.3; // 0.3
        this.fric_x = 0.26; // 0.3
        this.springFactor = 1.2;
        this.springBaseX = 2;

        this.canJump = false;
        this.falling = true;
        this.onBlock = false;

        this.hPower;
        this.vPower;

        this.minCharge = 0;
        this.maxCharge = 100;
        this.jumpCharge = this.minCharge;
        this.oldJumpCharge = this.jumpCharge;
        this.chargeOneLap = this.maxCharge / (180 / this.circleRotateSpd); // circleI * (Math.PI / 180)
        var spdAngle = this.circleRotateSpd * (Math.PI / 180); // 0.08
        var spdDiff = this.circleRotateSpd / this.maxCharge; // 0.045
        this.chargeSpd = spdAngle/spdDiff;


        console.log(spdAngle / spdDiff);
        console.log(0.08/0.45)
        console.log((this.circleRotateSpd * Math.PI / 180) * (this.circleRotateSpd / this.maxCharge))
        this.isCharging = false;
        this.bonusCharge = 30;
        this.jumpAmpH = 120;
        this.jumpAmpV = 120;

        // Coordinates
        this.x = 0; // 0
        this.y = -200; // -200
        this.centerX = (canvasW / 2) - (this.width / 2);
        this.centerY = (canvasH / 2) - (this.height / 2) + cameraY;


        /* -- Images -- */

        this.imgArrow = new Image();
        this.imgArrow.src = "img/arrow/arrow4.png";

        this.playerSheet = new Image();
        this.playerSheet.src = "img/player/64x64/player-sheet.png";

        // Sound handler
        this.canPlayBumpSound = false;
        this.soundHandler = soundHandler;

        // Animation
        this.sheetWidth = 192;
        this.sheetHeight = 64;
        this.sheetCols = 3;
        this.sheetRows = 1;
        this.frameCount = 3;
        this.frameWidth = this.sheetWidth / this.sheetCols;
        this.frameHeight = this.sheetHeight / this.sheetRows;
        this.currentFrame = 0;
        this.srcX;
        this.srcY;
        this.animationState = "idle";

        var that = this;
        document.body.onkeydown = function (e) {
            if (e.key == " " && that.canJump) {

                if (that.animationState == "idle") {
                    that.animationState = "chargeJump";
                }

                that.isCharging = true;
                that.jumpCharge += that.chargeSpd;

                if (that.jumpCharge >= that.maxCharge) {
                    that.isCharging = false;
                    that.jumpCharge = that.maxCharge;
                    that.jump();
                }
            }
            else if (e.key !== " " && that.canJump && that.isCharging)
                that.jump();
        }
        document.body.onkeyup = function (e) {
            //console.log(e);
            if (e.key == " " && that.isCharging) {
                that.jump();
            }
        };

        that.updatePlayerFrame();
        setInterval(function () {
            that.updatePlayerFrame();
        }, 100);
    }

    update() {
        this.gravity();
    }

    gravity() {
        //console.log(this.onBlock)
        if (this.onBlock) { // old - (this.y > 500)
            this.falling = false;
            this.canJump = true;
        }
        else {
            this.falling = true;
            this.canJump = false;
        }

        if (this.onBlock == false) { // old - (this.falling)

            this.velo_y += this.grav;
        }
        else {
            this.velo_y = -this.velo_y * this.fric_y;
            this.velo_x = this.velo_x * this.fric_x;
        }

        // Adjust vertical velocity
        if (this.velo_y < 1 && this.velo_y > 0) this.velo_y = 0;
        if (this.velo_y > this.max_velo_y) this.velo_y = this.max_velo_y;

        // Adjust horizontal velocity
        if (this.velo_x < 1 && this.velo_x > 0) this.velo_x = 0;

        this.y += this.velo_y;
        this.x += this.velo_x;
    }

    jump() {
        if (this.canJump) {
            // Play jump sound
            var volume = this.jumpCharge / this.maxCharge;
            if (volume > 0.4) volume = 0.4;
            else if (volume < 0.15) volume = 0.15;
            this.soundHandler.playSound("jump", volume);
            this.canPlayBumpSound = true;

            this.animationState = "jump";
            this.isCharging = false;

            this.updateJumpData();

            this.velo_y = this.vPower;
            this.velo_x = this.hPower;
            this.oldJumpCharge = this.jumpCharge;
            this.jumpCharge = this.minCharge;
        }
    }

    draw(ctx, canW, canH) {
        ctx.imageSmoothingEnabled = false;

        var cX = this.centerX + this.width / 2; // Player center X
        var cY = this.centerY + this.height / 2; // Player center Y


        /* --- Call drawing functions --- */

        //this.updatePlayerRotate();
        // Draw Player
        var playerData = {
            img: this.playerSheet,
            srcX: this.srcX,
            srcY: this.srcY,
            sheetWidth: this.sheetWidth,
            sheetHeight: this.sheetHeight,
            x: this.centerX,
            y: this.centerY,
            width: this.width,
            height: this.height,
            falling: this.falling,
            rotate: this.updatePlayerRotate(),
        };
        drawPlayer(playerData);


        // Circle around Player
        //drawOrbit(cX, cY, this.circleR);

        // Smaller arrow (circle) that orbits the lager circle
        drawArrow(this.imgArrow, this.circleI, this.circleR);

        // Draw charge bar if player is charging.
        if (this.isCharging)
            drawChargeBar(this.centerX, this.centerY, this.height, this.jumpCharge, this.maxCharge);


        /* ------------------------------- */


        // Update variables
        this.circleI += this.circleRotateSpd;
        this.circleAng = this.circleI * Math.PI / 180;
        this.circleI = this.circleI % 360;



        /* --- Drawing functions --- */

        function drawPlayer(data) {
            var that = this;
            ctx.save();
            ctx.beginPath();
            ctx.imageSmoothingEnabled = false;
            if (data.falling) {
                ctx.imageSmoothingEnabled = true;
                ctx.translate(cX, cY);
                ctx.rotate(data.rotate * Math.PI / 180);
                ctx.translate(-cX, -cY);
            }
            ctx.drawImage(data.img, data.srcX, data.srcY, data.width, data.height, data.x, data.y, data.width, data.height);
            ctx.closePath();
            ctx.restore();

        }

        function drawOrbit(cX, cY, circleR) {
            ctx.beginPath();
            ctx.arc(cX, cY, circleR, 0, 2 * Math.PI);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }

        function drawArrow(img, circleI, circleR) {
            var scR = 9; // Small Circle Radius
            var imgW = 40;
            var imgH = 40;
            var orbitSize = 120;

            ctx.save();


            ctx.translate(cX, cY); // Center on player
            ctx.rotate(circleI * (Math.PI / 180));

            ctx.translate(orbitSize, 0); // Orbit Radius same as Circle
            ctx.beginPath();
            ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
            /*             ctx.arc(0, 0, scR, 0, 2 * Math.PI);
                        ctx.fillStyle = "green";
                        ctx.fill(); */
            ctx.closePath();
            ctx.restore();
        }

        function drawChargeBar(centerX, centerY, height, jumpCharge, maxCharge) {
            var w = 25; var h = 80;
            var x = centerX - w - 35;
            var y = (centerY + height) - h;

            // Charging bar
            var h2 = (jumpCharge / maxCharge) * h;
            var y2 = (y + h) - h2;
            var grd = ctx.createLinearGradient(x, y, x, y + h);
            grd.addColorStop(0, "red");
            grd.addColorStop(0.6, "orange");
            grd.addColorStop(1, "green");

            ctx.beginPath();

            ctx.fillStyle = grd;
            ctx.fillRect(x, y2, w, h2);
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.closePath();

            // Charging bar outline
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();
            ctx.closePath();
        }

        /* ------------------------------- */

    }

    updatePlayerFrame() {
        this.currentFrame = ++this.currentFrame % this.sheetCols;
        //this.srcX = this.currentFrame * this.frameWidth;

        if (this.animationState == "chargeJump") {
            if (this.currentFrame == 1) {
                this.animationState = "chargeJumpDone";
            }
        }
        else if (this.animationState == "chargeJumpDone")
            this.currentFrame = 1;
        else if (this.animationState == "jump") {
            if (this.currentFrame == 2)
                this.animationState = "idle";
        }
        else if (this.animationState == "idle")
            this.currentFrame = 0;

        this.srcX = this.currentFrame * this.frameWidth;
        this.srcY = 0;
    }

    updateJumpData() {
        var cX = this.centerX + this.width / 2; // player center x
        var cY = this.centerY + this.height / 2; // player center y


        // value from 0-1 - max vertical angle results in 1 etc..
        var vAngle = -Math.sin(this.circleAng).toFixed(4);
        var hAngle = Math.cos(this.circleAng).toFixed(4);


        // Get value based on charge bar
        var jumpChargeTot = (this.jumpCharge + this.bonusCharge > this.maxCharge) ? this.maxCharge : (this.jumpCharge + this.bonusCharge);

        // Value between 0-1  -  1 = full charge, 0 = no charge
        jumpChargeTot = jumpChargeTot / this.maxCharge;


        // Bug so you cant jump down through blocks.
        if (vAngle < 0) vAngle = 0;
        //if (h < 0) h = 0;


        // Angle direction 0-1 * charge bar 0-1 * jump amp value
        this.hPower = hAngle * jumpChargeTot * this.jumpAmpH;
        this.vPower = vAngle * jumpChargeTot * this.jumpAmpV;
    }

    updatePlayerRotate() {

        var rotate;
        var vx = Math.abs(this.velo_x); var vy = Math.abs(this.velo_y);
        var veloTot = (vx > vy) ? this.velo_x : this.velo_y;

        if (veloTot * 2 < vx + vy)
            veloTot = vx + vy;

        if (this.falling)
            this.playerRotate += veloTot / 3;
        else
            this.playerRotate = 0;

        if (this.hPower < 0)
            rotate = -Math.abs(this.playerRotate);
        else
            rotate = Math.abs(this.playerRotate);


        return rotate;

    }
}