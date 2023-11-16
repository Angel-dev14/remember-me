enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

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
    musicButton?.addEventListener("click", function () {
      musicButton.classList.toggle("activeMusic");
      SoundPlayer.toggleMute(SoundType.MUSIC);
      musicButton.classList.toggle("deactivatedMusic");
    });
    soundButton?.addEventListener("click", function () {
      soundButton.classList.toggle("activeSounds");
      SoundPlayer.toggleMute(SoundType.GENERAL);
      soundButton.classList.toggle("deactivatedSounds");
    });
  }
};

customElements.define("custom-header", Header);

class Game {
  private readonly gameModes: GameMode[];
  private readonly quitBtn: Quit;

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
  private readonly quitBtnRef: HTMLButtonElement;

  constructor() {
    this.quitBtnRef = document.getElementById("quit") as HTMLButtonElement;
    this.quitBtnRef?.addEventListener("click", () => this.buttonClick());
  }

  buttonClick() {
    if (
      window.confirm(
        "Are you sure you want to quit? There's no escape from fun!"
      )
    ) {
      window.location.href = "https://github.com/JustAnotherHeroRiding";
    }
  }
}

abstract class GameMode {
  protected readonly button: HTMLButtonElement;
  protected readonly difficulty: Difficulty;

  constructor(buttonId: string, difficulty: Difficulty) {
    this.button = document.getElementById(buttonId) as HTMLButtonElement;
    this.difficulty = difficulty;
    this.addListener();
  }

  protected addListener(): void {
    this.button?.addEventListener("click", () => {
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
  static create(difficulty: Difficulty): GameMode {
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

export enum SoundFiles {
  SUCCESS = "successBellShort.wav",
  FAILURE = "trumpetFail.wav",
  START = "gameStart.wav",
  VICTORY = "victoryReverb.wav",
  DEFEAT = "gameLost.wav",
  GAME_MUSIC = "gameMusic.ogg",
}

export enum SoundType {
  GENERAL = "GENERAL",
  MUSIC = "MUSIC",
}
export class SoundPlayer {
  private static isMuted: boolean = false;
  private static isMusicMuted: boolean = true;
  private static musicAudio: HTMLAudioElement | null = null;

  static {
    Object.values(SoundFiles).forEach((file) => {
      const audio = new Audio(`sounds/${file}`);
      audio.load();
    });
  }

  static toggleMute(type: SoundType) {
    if (type === SoundType.GENERAL) {
      this.isMuted = !this.isMuted;
    } else if (type === SoundType.MUSIC) {
      this.isMusicMuted = !this.isMusicMuted;

      if (this.musicAudio) {
        if (this.isMusicMuted) {
          this.musicAudio.pause();
        } else {
          this.musicAudio.play();
        }
      } else {
        this.isMusicMuted = false;
        this.playSound("GAME_MUSIC", -1);
      }
    }
  }

  static playSound(soundType: keyof typeof SoundFiles, loopCount: number = 0) {
    if (this.isMuted || (soundType === "GAME_MUSIC" && this.isMusicMuted))
      return;

    const soundFile = SoundFiles[soundType];
    const audio = new Audio(`sounds/${soundFile}`);

    if (soundType === "FAILURE") {
      audio.volume = 0.4;
    } else if (soundType === "GAME_MUSIC") {
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

const game = new Game();
