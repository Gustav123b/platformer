class Block {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.canvasCenterX = this.canvas.width / 2;
        this.canvasCenterY = this.canvas.height / 2;

        this.useImage = false;
        this.usePattern = false;
        this.img = new Image();
        this.pattern = new Image();
    }

    draw(ctx, block) {
        this.img = new Image();
        var x = block[0]; var y = block[1]; var w = block[2]; var h = block[3]; var type = block[4]; var texture = block[5];
        var color = this.getTexture(texture);
        //console.log(block[4])

        ctx.beginPath();
        if (this.useImage) {
            ctx.drawImage(this.img, x, y, w, h);
        }
        else if (this.usePattern) {
            var pattern = ctx.createPattern(this.pattern, "repeat");

            ctx.save();
            ctx.rect(x, y, w, h);
            ctx.fillStyle = pattern;
            /* Translate stops the pattern from moving 
               when the player is moving. Idk why. */
            ctx.translate(x, y);
            ctx.fill();
            ctx.restore();
        }
        else {
            ctx.rect(x, y, w, h);
            ctx.fillStyle = color;
            ctx.fill();
        }
        ctx.closePath();
    }

    getTexture(texture) {
        this.useImage = false;
        this.usePattern = false;

        // If there is image to texture
        if (texture == "skin-spring") {
            this.useImage = true;
            this.img.src = "img/spring/skin/skin.png";
            return 0;
        }
        else if (texture == "stone") {
            this.useImage = true;
            this.img.src = "img/block/stone/stone.png";
            return 0;
        }
        else if (texture == "stone-pattern") {
            this.usePattern = true;
            this.pattern.src = "img/block/stone/stone.png";
            return 0;
        }
        // If there is no image to texture
        else {
            this.useImage = false;
            this.usePattern = false;

            if (texture == "texture1")
                return "#001011";
            else if (texture == "grass")
                return "#0C7C59";
            else if (texture == "dirt")
                return "#4E5340";
            else
                return texture;
        }
    }

    getAvailableTextures() {
        var textures = ["stone", "skin-spring"];

        return textures;
    }

    getImageTexture(texture) {
        if (texture == "skin-spring")
            return "img/spring/skin/skin.png";
        else if (texture == "stone")
            return "img/block/stone/stone.png";
    }
}