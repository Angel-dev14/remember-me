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
      <div class="logo">
          <i class="fa-solid fa-brain" style="color: white"></i>
      </div>
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
      window.location.href = `game.html?gameMode=${this.difficulty}`;
    });
  }
}

class MediumMode extends GameMode {
  constructor() {
    super("medium", Difficulty.MEDIUM);
  }

  addListener(): void {
    this.button.addEventListener("click", () => {
      window.location.href = `game.html?gameMode=${this.difficulty}`;
      //     query navigate
    });
  }
}

class HardMode extends GameMode {
  constructor() {
    super("hard", Difficulty.HARD);
  }

  addListener(): void {
    this.button.addEventListener("click", () => {
      window.location.href = `game.html?gameMode=${this.difficulty}`;
    });
  }
}
if (window.location.pathname.endsWith("/remember-me/")) {
  const game = new Game();
}
