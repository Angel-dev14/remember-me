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
        SoundPlayer.toggleMute();
        soundButton.classList.toggle("deactivatedSounds");
      });
    }
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
    this.quitBtnRef.addEventListener("click", () => this.buttonClick());
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
    this.button.addEventListener("click", () => {
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

export class SoundPlayer {
  private static isMuted: boolean = false;

  static toggleMute() {
    this.isMuted = !this.isMuted;
  }

  static playSound(match: boolean) {
    if (this.isMuted) return;

    const audio = new Audio(
      `./sounds/${match ? "successBellShort.wav" : "fuzzed3Steps.wav"}`
    );
    audio.play();
  }
}

if (window.location.pathname.endsWith("/remember-me/")) {
  const game = new Game();
}
