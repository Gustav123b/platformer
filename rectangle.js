class Rectangle {
    constructor() {

    }

    intersectCheck(ob1, ob2, em) {
        var x1 = ob1[0]; var y1 = ob1[1]; var w1 = ob1[2]; var h1 = ob1[3];
        var x2 = ob2[0]; var y2 = ob2[1]; var w2 = ob2[2]; var h2 = ob2[3];

        if (x1 > x2 + w2 + em)
            return [false, "asd"];
        else if (x1 + w1 + em < x2)
            return [false, "asd2"];

        // X values align for collision
        else {
            if (y1 + h1 + em > y2 && y1 < y2 + em)
                return [true, ["stay", "top"]];

            // Hits a block from the side
            else if (y1 + h1 > y2 + em && y1 + em < y2 + h2) {
                if (x1 < x2) {
                    return [true, ["fall", "left"]];
                }
                else {
                    return [true, ["fall", "right"]];
                }
            }
            else if (y1 < y2 + h2 + em && y1 + h1 > y2 + h2)
                return [true, ["fall", "down"]];

            else
                return [false, false];
        }
    }
}