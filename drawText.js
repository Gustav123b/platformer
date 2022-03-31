class DrawText {
    constructor() {

    }

    draw(ctx, textArr) {
        var x = textArr[0]; var y = textArr[1]; var fs = textArr[2]; var text = textArr[3]; var color = textArr[4];

        ctx.beginPath();
        ctx.font = fs + "px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        ctx.closePath();
    }

    getText(id) {
        if (id == "introText")
            return "Hold down Spacebar to charge up a jump!";
        else if (id == "tooFarBack")
            return "Wrong direction..";
        else if (id == "wallClimbFeature")
            return "";
    }
}