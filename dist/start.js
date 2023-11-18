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
    <div class="header-buttons">
    <div class="logo-button"">
        <a class='logo'>
           <img onclick="!window.location.href.endsWith('/remember-me/') && window.history.back()" 
           class='logo' src="./images/logo/logo.png" alt="header logo" width="50px" heigth="auto">
        </a>
       </div>
    </div>
    <div class="logo-title">
      <div class="title">
        <p>Remember Me</p>
      </div>
      </div>
      <div class="header-buttons">
              <button id="musicButton" class="header-button deactivatedMusic" title="Toggle Music"></button>
              <button id="soundButton" class="header-button activeSounds" title="Toggle Game Sounds"></button>
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
            SoundPlayer.toggleMute(SoundType.MUSIC);
            musicButton.classList.toggle("deactivatedMusic");
        });
        soundButton === null || soundButton === void 0 ? void 0 : soundButton.addEventListener("click", function () {
            soundButton.classList.toggle("activeSounds");
            SoundPlayer.toggleMute(SoundType.GENERAL);
            soundButton.classList.toggle("deactivatedSounds");
        });
    }
};
export const Footer = class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="footer">
    <div class="row">
    <p>Made with ❤️ by <a href="https://github.com/JustAnotherHeroRiding" target="_blank">JustAnotherHeroRiding</a></p>
    <i class="fa-brands fa-github logo" style="color: #ffb703;"></i>
    </a>
    </div>
    <div class="row">
    <i class="fa-brands fa-github logo" style="color: #ffb703;"></i>
    <p>Made with ❤️ by <a href="https://github.com/Angel-dev14" target="_blank">Angel-dev14</a></p>
    </a>
    </div>
    </div>
      `;
    }
};
customElements.define("custom-header", Header);
customElements.define("custom-footer", Footer);
class Game {
    constructor() {
        Object.values(Difficulty).forEach((diff) => {
            const gameMode = GameModeFactory.create(diff);
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
    SoundFiles["VICTORY"] = "victoryReverb.wav";
    SoundFiles["DEFEAT"] = "gameLost.wav";
    SoundFiles["GAME_MUSIC"] = "gameMusic.ogg";
})(SoundFiles || (SoundFiles = {}));
export var SoundType;
(function (SoundType) {
    SoundType["GENERAL"] = "GENERAL";
    SoundType["MUSIC"] = "MUSIC";
})(SoundType || (SoundType = {}));
export class SoundPlayer {
    static toggleMute(type) {
        if (type === SoundType.GENERAL) {
            this.isMuted = !this.isMuted;
        }
        else if (type === SoundType.MUSIC) {
            this.isMusicMuted = !this.isMusicMuted;
            if (this.musicAudio) {
                if (this.isMusicMuted) {
                    this.musicAudio.pause();
                }
                else {
                    this.musicAudio.play();
                }
            }
            else {
                this.isMusicMuted = false;
                this.playSound("GAME_MUSIC", -1);
            }
        }
    }
    static playSound(soundType, loopCount = 0) {
        if (this.isMuted || (soundType === "GAME_MUSIC" && this.isMusicMuted))
            return;
        const soundFile = SoundFiles[soundType];
        const audio = new Audio(`sounds/${soundFile}`);
        if (soundType === "FAILURE") {
            audio.volume = 0.4;
        }
        else if (soundType === "GAME_MUSIC") {
            audio.volume = 0.1;
            this.musicAudio = audio;
        }
        let playedTimes = 0;
        const playOrLoop = () => {
            playedTimes++;
            if (loopCount === -1 || playedTimes <= loopCount) {
                audio.currentTime = 0;
                audio.play();
            }
        };
        audio.addEventListener("ended", playOrLoop);
        audio.play();
    }
}
SoundPlayer.isMuted = false;
SoundPlayer.isMusicMuted = true;
SoundPlayer.musicAudio = null;
(() => {
    Object.values(SoundFiles).forEach((file) => {
        const audio = new Audio(`sounds/${file}`);
        audio.load();
    });
})();
new Game();
//# sourceMappingURL=start.js.map