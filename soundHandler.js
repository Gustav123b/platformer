class SoundHandler {
    constructor() {

        /* --- BACKGROUND MUSIC --- */

        // bensound-evolution     
        this.bg = new Audio("audio/bg/bensound-evolution.mp3");
        this.bg.preload = "auto";
        this.bg.load();

        /* --- PLAYER --- */

        // Jump Sound
        this.jump = new Audio("audio/jump/jump.mp3");
        this.jump.preload = "auto";
        this.jump.load();

        // Bump sounds

        // Stone collision
        this.bump = new Audio("audio/bump/bump_03.mp3");
        this.bump.preload = "auto";
        this.bump.load();

        // Spring collision
        this.spring = new Audio("audio/spring/spring_04.mp3");
        this.spring.preload = "auto";
        this.spring.load();
    }

    playSound(sound, volume, loop) {
        //console.log(sound)
        // Get sound volume
        var v = (volume !== undefined) ? volume : this.getSoundData(sound, "volume");
        eval("this." + sound + ".volume = " + v);

        // Get sound loop
        var l = (loop !== undefined) ? loop : this.getSoundData(sound, "loop");
        eval("this." + sound + ".volume = " + v);

        // Play sound
        eval("this." + sound + ".play();");
    }

    stopSound(sound) {
        eval("this." + sound + ".pause();");
        eval("this." + sound + ".currentTime = 0;");
    }

    getSoundData(sound, attr) {
        var data;

        if (sound == "jump") {
            data = {
                volume: 0.3,
                loop: false,
            };
        }
        else if (sound == "bump") {
            data = {
                volume: 0.5,
                loop: false,
            };
        }
        else if (sound == "spring") {
            data = {
                volume: 1,
                loop: false,
            }
        }
        else if (sound == "bg") {
            data = {
                volume: 0.3,
                loop: true,
            };
        }

        var returnData = eval("data." + attr);

        return returnData;
    }

    getSoundFromBlock(block) {
        if (block == "block")
            return "bump";
        else if (block == "spring")
            return "spring";
        else
            return false;
    }
}