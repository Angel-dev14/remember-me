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
    <a class='logo'>
           <img onclick="!window.location.href.endsWith('/remember-me/') && window.history.back()" 
           class='logo' src="./images/logo/logo.png" alt="header logo" width="50px" heigth="auto">
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
        musicButton === null || musicButton === void 0 ? void 0 : musicButton.addEventListener("click", function () {
            musicButton.classList.toggle("activeMusic");
            musicButton.classList.toggle("deactivatedMusic");
        });
        soundButton === null || soundButton === void 0 ? void 0 : soundButton.addEventListener("click", function () {
            soundButton.classList.toggle("activeSounds");
            SoundPlayer.toggleMute();
            soundButton.classList.toggle("deactivatedSounds");
        });
    }
};
customElements.define("custom-header", Header);
class Game {
    constructor() {
        this.gameModes = [];
        Object.values(Difficulty).forEach((diff) => {
            const gameMode = GameModeFactory.create(diff);
            this.gameModes.push(gameMode);
        });
        this.quitBtn = new Quit();
    }
}
class Quit {
    constructor() {
        var _a;
        this.quitBtnRef = document.getElementById("quit");
        (_a = this.quitBtnRef) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.buttonClick());
    }
    buttonClick() {
        if (window.confirm("Are you sure you want to quit? There's no escape from fun!")) {
            window.location.href = "https://github.com/JustAnotherHeroRiding";
        }
    }
}
class GameMode {
    constructor(buttonId, difficulty) {
        this.button = document.getElementById(buttonId);
        this.difficulty = difficulty;
        this.addListener();
    }
    addListener() {
        var _a;
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            localStorage.setItem("playStartSound", "true");
            const params = new URLSearchParams({ gameMode: this.difficulty });
            window.location.href = `game.html?${params.toString()}`;
        });
    }
}
class EasyMode extends GameMode {
    constructor() {
        super("easy", Difficulty.EASY);
    }
}
class MediumMode extends GameMode {
    constructor() {
        super("medium", Difficulty.MEDIUM);
    }
}
class HardMode extends GameMode {
    constructor() {
        super("hard", Difficulty.HARD);
    }
}
class GameModeFactory {
    static create(difficulty) {
        switch (difficulty) {
            case Difficulty.EASY:
                return new EasyMode();
            case Difficulty.MEDIUM:
                return new MediumMode();
            case Difficulty.HARD:
                return new HardMode();
            default:
                throw new Error("Invalid difficulty level");
        }
    }
}
export var SoundFiles;
(function (SoundFiles) {
    SoundFiles["SUCCESS"] = "successBellShort.wav";
    SoundFiles["FAILURE"] = "trumpetFail.wav";
    SoundFiles["START"] = "gameStart.wav";
})(SoundFiles || (SoundFiles = {}));
export class SoundPlayer {
    static toggleMute() {
        this.isMuted = !this.isMuted;
    }
    static playSound(soundType) {
        if (this.isMuted)
            return;
        const soundFile = SoundFiles[soundType];
        const audio = new Audio(`sounds/${soundFile}`);
        if (soundType === "FAILURE") {
            audio.volume = 0.8;
        }
        audio.play();
    }
}
SoundPlayer.isMuted = false;
(() => {
    Object.values(SoundFiles).forEach((file) => {
        const audio = new Audio(`sounds/${file}`);
        audio.load();
    });
})();
const game = new Game();
//# sourceMappingURL=start.js.map