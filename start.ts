enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}
export const Header = class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="header">
      <div class="title">
        <p>Remember Me</p>
      </div>
          <a class='logo' href="http://127.0.0.1:5500/Websites/Lesson%202%20-%20Memory%20Game/remember-me/">
            <img class='logo' src="./images/logo/logo.png" alt="header logo" width="50px" heigth="auto">
          </a>
    </div>
      `;
  }
};

customElements.define("custom-header", Header);
class Game {
  private gameModes: GameMode[];

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
  private quitBtnRef: HTMLButtonElement;

  constructor() {
    this.quitBtnRef = document.getElementById("quit") as HTMLButtonElement;
    this.quitBtnRef.addEventListener("click", () => this.buttonClick());
  }

  buttonClick() {
    console.log("Quit clicked");
  }
}

class GameModeCreator {
  static create(difficulty: Difficulty) {
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

abstract class GameMode {
  protected button: HTMLButtonElement;
  protected difficulty: string;

  constructor(buttonId: string, diffilculty: Difficulty) {
    this.button = document.getElementById(buttonId) as HTMLButtonElement;
    this.difficulty = diffilculty;
    this.addListener();
  }

  abstract addListener(): void;
}

class EasyMode extends GameMode {
  constructor() {
    super("easy", Difficulty.EASY);
  }

  addListener(): void {
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

  addListener(): void {
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

  addListener(): void {
    this.button.addEventListener("click", () => {
      const params = new URLSearchParams({ gameMode: this.difficulty });
      window.location.href = `game.html?${params.toString()}`;
    });
  }
}
if (window.location.pathname.endsWith("/remember-me/")) {
  const game = new Game();
}
