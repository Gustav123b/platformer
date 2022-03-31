class LevelFactory {
    constructor() {

    }

    createLevel(level) {
        this.blocks;
        this.textArr;

        if (level == "1.1") {
            this.base1;
            this.blocks = [

                // Grass
                [-3000, 0, 20000, 2000, "block", "dirt"],
                [-3000, 0, 20000, 130, "block", "grass"],

                // First blocks
                [400, -130, 80, 130, "block", "stone"],
                [800, -300, 80, 300, "block", "stone-pattern"],
                [1200, -90, 1305, 90, "block", "stone-pattern"],
                [1800, -320, 250, 30, "block", "texture1"],

                // Pole under block
                [2400, -650, 250, 30, "block", "texture1"], // top platform
                [2505, -650, 40, 90, "block", "texture1"], // top pole
                [2475, -350, 100, 30, "block", "texture1"], // bottom platform
                [2505, -350, 40, 350, "block", "texture1"], // bottom pole

                [3100, -650, 250, 30, "block", "texture1"],

                // Blocks on ground
                [3050, -80, 200, 80, "block", "stone-pattern"],

                /* -- First Base -- */
                [3700, -650, 800, 300, "block", "texture1"],
                [4800, -650, 2000, 300, "block", "texture1"],
                [5300, -850, 200, 200, "block", "texture1"],
                [5750, -1000, 200, 350, "block", "texture1"],
                // Blocks under base
                [3700, -350, 100, 150, "block", "texture1"],
                [4100, -150, 100, 150, "block", "texture1"],

                // Second blocks
                [5100, -1300, 400, 30, "block", "texture1"],
                [4100, -1300, 400, 30, "block", "texture1"],
                [2600, -1300, 900, 50, "block", "texture1"],
                [2600, -1350, 96, 50, "spring", "skin-spring"],
                [2800, -1550, 80, 250, "block", "texture1"],
                [2100, -1400, 250, 50, "block", "texture1"],

                /* -- Second Base -- */
                [1200, -1250, 500, 50, "block", "texture1"],
                [1650, -1600, 50, 400, "block", "texture1"],
                [1280, -1300, 96, 50, "spring", "skin-spring"],

                // Blocks
                [-800, -1500, 1700, 50, "block", "texture1"],
                [80, -1550, 96, 50, "spring", "skin-spring"],
                [180, -1550, 96, 50, "spring", "skin-spring"],
                [400, -2300, 250, 50, "block", "texture1"], // Block high up, requires spring
                [-400, -1800, 200, 50, "block", "texture1"],

                // Spring trap , long block
                [1200, -2300, 700, 50, "block", "texture1"],
                [1450, -2350, 96, 50, "spring", "skin-spring"],
                [1550, -2350, 96, 50, "spring", "skin-spring"],
                [1650, -2350, 96, 50, "spring", "skin-spring"],

                /* -- Third Base -- */
                [2500, -2300, 2000, 50, "block", "texture1"],
            ];

            this.textArr = [
                // x, y, fontsize, textID, textColor

                // Intro Text Instructions
                [0, -150, 50, "introText", "#5C5C5C"],
                [-1300, -50, 40, "tooFarBack", "#5C5C5C"],
                [1400, -350, 40, "wallClimbFeature", "#5C5C5C"],
            ];
        }

        return [this.blocks, this.textArr];
    }
}