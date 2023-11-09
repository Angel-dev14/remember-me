"use strict";
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
})(Difficulty || (Difficulty = {}));
class Game {
    constructor() {
        this.gameModes = [];
        Object.values(Difficulty).forEach((diff) => {
            const gameMode = GameModeCreator.create(diff);
            this.gameModes.push(gameMode);
        });
    }
    start() {
        // this.gameMode.start()
    }
}
class GameModeCreator {
    static create(difficulty) {
        switch (difficulty) {
            case Difficulty.EASY:
                return new EasyMode();
            case Difficulty.MEDIUM:
                return new MediumMode();
            default:
                return new HardMode();
        }
    }
}
class GameMode {
    constructor(buttonId, diffilculty) {
        this.button = document.getElementById(buttonId);
        this.difficulty = diffilculty;
        this.addListener();
    }
}
class EasyMode extends GameMode {
    constructor() {
        super("easy", Difficulty.EASY);
    }
    addListener() {
        this.button.addEventListener("click", () => {
            localStorage.setItem("size", String(2));
            window.location.href = 'game.html';
        });
    }
}
class MediumMode extends GameMode {
    constructor() {
        super("medium", Difficulty.MEDIUM);
    }
    addListener() {
        this.button.addEventListener("click", () => {
            localStorage.setItem("size", String(4));
            window.location.href = 'game.html';
            //     query navigate
        });
    }
}
class HardMode extends GameMode {
    constructor() {
        super("hard", Difficulty.HARD);
    }
    addListener() {
        this.button.addEventListener("click", () => {
            console.log('cliick hard');
        });
    }
}
const game = new Game();
//# sourceMappingURL=start.js.map