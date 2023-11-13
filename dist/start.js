var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
})(Difficulty || (Difficulty = {}));
export const Header = class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="header">
    <div class="spacer"></div>
    <div class="logo-title">
    <a class='logo' href="http://127.0.0.1:5500/Websites/Lesson%202%20-%20Memory%20Game/remember-me/">
            <img class='logo' src="./images/logo/logo.png" alt="header logo" width="50px" heigth="auto">
          </a>
      <div class="title">
        <p>Remember Me</p>
      </div>
          
          </div>

          <div class="header-buttons">
          <button id="musicButton" class="header-button activeMusic"></button>
          <button id="soundButton" class="header-button activeSounds"></button>
          </div>
    </div>
      `;
        this.setupEventListeners();
    }
    setupEventListeners() {
        const musicButton = this.querySelector("#musicButton");
        const soundButton = this.querySelector("#soundButton");
        if (musicButton) {
            musicButton.addEventListener("click", function () {
                musicButton.classList.toggle("activeMusic");
                musicButton.classList.toggle("deactivatedMusic");
            });
        }
        if (soundButton) {
            soundButton.addEventListener("click", function () {
                soundButton.classList.toggle("activeSounds");
                soundButton.classList.toggle("deactivatedSounds");
            });
        }
    }
};
customElements.define("custom-header", Header);
class Game {
    constructor() {
        this.gameModes = [];
        Object.values(Difficulty).forEach((diff) => {
            const gameMode = GameModeCreator.create(diff);
            this.gameModes.push(gameMode);
            this.start();
        });
    }
    start() {
        const quitBtn = new Quit();
    }
}
class Quit {
    constructor() {
        this.quitBtnRef = document.getElementById("quit");
        this.quitBtnRef.addEventListener("click", () => this.buttonClick());
    }
    buttonClick() {
        console.log("Quit clicked");
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
            const params = new URLSearchParams({ gameMode: this.difficulty });
            window.location.href = `game.html?${params.toString()}`;
        });
    }
}
class MediumMode extends GameMode {
    constructor() {
        super("medium", Difficulty.MEDIUM);
    }
    addListener() {
        this.button.addEventListener("click", () => {
            const params = new URLSearchParams({ gameMode: this.difficulty });
            window.location.href = `game.html?${params.toString()}`;
        });
    }
}
class HardMode extends GameMode {
    constructor() {
        super("hard", Difficulty.HARD);
    }
    addListener() {
        this.button.addEventListener("click", () => {
            const params = new URLSearchParams({ gameMode: this.difficulty });
            window.location.href = `game.html?${params.toString()}`;
        });
    }
}
if (window.location.pathname.endsWith("/remember-me/")) {
    const game = new Game();
}
//# sourceMappingURL=start.js.map