"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundPlayer = exports.SoundType = exports.SoundFiles = exports.Footer = exports.Header = void 0;
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
})(Difficulty || (Difficulty = {}));
exports.Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.connectedCallback = function () {
        this.innerHTML = "\n    <div class=\"header\">\n    <div class=\"logo-title\">\n    <a class='logo'>\n           <img onclick=\"!window.location.href.endsWith('/remember-me/') && window.history.back()\" \n           class='logo' src=\"./images/logo/logo.png\" alt=\"header logo\" width=\"50px\" heigth=\"auto\">\n          </a>\n      <div class=\"title\">\n        <p>Remember Me</p>\n      </div>\n          </div>\n          <div class=\"header-buttons\">\n          <button id=\"musicButton\" class=\"header-button deactivatedMusic\" title=\"Toggle Music\"></button>\n          <button id=\"soundButton\" class=\"header-button activeSounds\" title=\"Toggle Game Sounds\"></button>\n          </div>\n    </div>\n      ";
        this.setupEventListeners();
    };
    Header.prototype.setupEventListeners = function () {
        var musicButton = this.querySelector("#musicButton");
        var soundButton = this.querySelector("#soundButton");
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
    };
    return Header;
}(HTMLElement));
exports.Footer = /** @class */ (function (_super) {
    __extends(Footer, _super);
    function Footer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Footer.prototype.connectedCallback = function () {
        this.innerHTML = "\n    <div class=\"footer\">\n    <div class=\"row\">\n    <p>Made with \u2764\uFE0F by <a href=\"https://github.com/JustAnotherHeroRiding\" target=\"_blank\">JustAnotherHeroRiding</a></p>\n    <i class=\"fa-brands fa-github logo\" style=\"color: #ffb703;\"></i>\n    </a>\n    </div>\n    <div class=\"row\">\n    <i class=\"fa-brands fa-github logo\" style=\"color: #ffb703;\"></i>\n    <p>Made with \u2764\uFE0F by <a href=\"https://github.com/Angel-dev14\" target=\"_blank\">Angel-dev14</a></p>\n    </a>\n    </div>\n    </div>\n      ";
    };
    return Footer;
}(HTMLElement));
customElements.define("custom-header", exports.Header);
customElements.define("custom-footer", exports.Footer);
var Game = /** @class */ (function () {
    function Game() {
        Object.values(Difficulty).forEach(function (diff) {
            var gameMode = GameModeFactory.create(diff);
        });
        this.quitBtn = new Quit();
    }
    return Game;
}());
var Quit = /** @class */ (function () {
    function Quit() {
        var _this = this;
        var _a;
        this.quitBtnRef = document.getElementById("quit");
        (_a = this.quitBtnRef) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return _this.buttonClick(); });
    }
    Quit.prototype.buttonClick = function () {
        if (window.confirm("Are you sure you want to quit? There's no escape from fun!")) {
            window.location.href = "https://github.com/JustAnotherHeroRiding";
        }
    };
    return Quit;
}());
var GameMode = /** @class */ (function () {
    function GameMode(buttonId, difficulty) {
        this.button = document.getElementById(buttonId);
        this.difficulty = difficulty;
        this.addListener();
    }
    GameMode.prototype.addListener = function () {
        var _this = this;
        var _a;
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            localStorage.setItem("playStartSound", "true");
            var params = new URLSearchParams({ gameMode: _this.difficulty });
            window.location.href = "game.html?".concat(params.toString());
        });
    };
    return GameMode;
}());
var EasyMode = /** @class */ (function (_super) {
    __extends(EasyMode, _super);
    function EasyMode() {
        return _super.call(this, "easy", Difficulty.EASY) || this;
    }
    return EasyMode;
}(GameMode));
var MediumMode = /** @class */ (function (_super) {
    __extends(MediumMode, _super);
    function MediumMode() {
        return _super.call(this, "medium", Difficulty.MEDIUM) || this;
    }
    return MediumMode;
}(GameMode));
var HardMode = /** @class */ (function (_super) {
    __extends(HardMode, _super);
    function HardMode() {
        return _super.call(this, "hard", Difficulty.HARD) || this;
    }
    return HardMode;
}(GameMode));
var GameModeFactory = /** @class */ (function () {
    function GameModeFactory() {
    }
    GameModeFactory.create = function (difficulty) {
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
    };
    return GameModeFactory;
}());
var SoundFiles;
(function (SoundFiles) {
    SoundFiles["SUCCESS"] = "successBellShort.wav";
    SoundFiles["FAILURE"] = "trumpetFail.wav";
    SoundFiles["START"] = "gameStart.wav";
    SoundFiles["VICTORY"] = "victoryReverb.wav";
    SoundFiles["DEFEAT"] = "gameLost.wav";
    SoundFiles["GAME_MUSIC"] = "gameMusic.ogg";
})(SoundFiles || (exports.SoundFiles = SoundFiles = {}));
var SoundType;
(function (SoundType) {
    SoundType["GENERAL"] = "GENERAL";
    SoundType["MUSIC"] = "MUSIC";
})(SoundType || (exports.SoundType = SoundType = {}));
var SoundPlayer = /** @class */ (function () {
    function SoundPlayer() {
    }
    SoundPlayer.toggleMute = function (type) {
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
    };
    SoundPlayer.playSound = function (soundType, loopCount) {
        if (loopCount === void 0) { loopCount = 0; }
        if (this.isMuted || (soundType === "GAME_MUSIC" && this.isMusicMuted))
            return;
        var soundFile = SoundFiles[soundType];
        var audio = new Audio("sounds/".concat(soundFile));
        if (soundType === "FAILURE") {
            audio.volume = 0.4;
        }
        else if (soundType === "GAME_MUSIC") {
            audio.volume = 0.1;
            this.musicAudio = audio;
        }
        var playedTimes = 0;
        var playOrLoop = function () {
            playedTimes++;
            if (loopCount === -1 || playedTimes <= loopCount) {
                audio.currentTime = 0;
                audio.play();
            }
        };
        audio.addEventListener("ended", playOrLoop);
        audio.play();
    };
    SoundPlayer.isMuted = false;
    SoundPlayer.isMusicMuted = true;
    SoundPlayer.musicAudio = null;
    (function () {
        Object.values(SoundFiles).forEach(function (file) {
            var audio = new Audio("sounds/".concat(file));
            audio.load();
        });
    })();
    return SoundPlayer;
}());
exports.SoundPlayer = SoundPlayer;
new Game();
