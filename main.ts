import { fields } from "./possibleImages.js";
const ANIMATION_LENGTH = 6000;
const BLOCK_OPEN_ANIMATION_LENGTH = 600;

type BoardSettings = {
  gameLength: number;
  timeoutSpeed: number;
  size: number;
};

enum Difficulties {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

const DifficultySettings: {
  [key in Difficulties]: {
    gameLength: number;
    timeoutSpeed: number;
    size: number;
  };
} = {
  [Difficulties.EASY]: { gameLength: 5, timeoutSpeed: 2000, size: 3 },
  [Difficulties.MEDIUM]: { gameLength: 5, timeoutSpeed: 1500, size: 4 },
  [Difficulties.HARD]: { gameLength: 3, timeoutSpeed: 1000, size: 6 },
};

abstract class Animation {
  protected headingElementRef: HTMLElement;
  protected parentContainerRef: HTMLDivElement;

  protected constructor(elementRef: HTMLElement) {
    this.headingElementRef = elementRef;
    this.parentContainerRef = document.getElementById(
      "gameoverParent"
    ) as HTMLDivElement;
    this.parentContainerRef
      .querySelector(".gameover-x-mark")
      ?.addEventListener("click", () => {
        this.parentContainerRef.style.display = "none";
        this.headingElementRef.textContent = "";
      });
  }

  abstract start(): void;

  abstract stop(): void;

  protected animateElements(
    emoji: string,
    finalMessage: string,
    count: number
  ) {
    const elementsArray: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
      const element = ImprovedElementCreator.createElement(
        ElementType.DIV,
        "game-over-fall",
        undefined,
        emoji
      ) as HTMLDivElement;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.animationDuration = `${Math.random() * 2 + 3}s`;
      elementsArray.push(element);
      document.body.appendChild(element);
    }
    setTimeout(() => {
      this.parentContainerRef.style.display = "flex";
      this.headingElementRef.textContent = finalMessage;
      this.parentContainerRef
        .querySelector(".reset-btn")
        ?.addEventListener("click", () => {
          location.reload();
        });
    }, ANIMATION_LENGTH);

    return elementsArray;
  }
}

class ConfettiAnimation extends Animation {
  private confettiArray: HTMLElement[] = [];
  private confettiCount = 200;

  constructor(headingElementRef: HTMLHeadingElement) {
    super(headingElementRef);
  }

  start() {
    this.confettiArray = this.animateElements(
      "🎉",
      "You won",
      this.confettiCount
    );
  }

  stop() {
    this.confettiArray.forEach((confetti) => confetti.remove());
    this.confettiArray = [];
  }
}

class TimeOutAnimation extends Animation {
  private gameOverElements: HTMLElement[] = [];
  private elementCount = 200;

  constructor(headingElementRef: HTMLHeadingElement) {
    super(headingElementRef);
  }

  start() {
    this.gameOverElements = this.animateElements(
      "⏰",
      "Time's Up!",
      this.elementCount
    );
  }

  stop() {
    this.gameOverElements.forEach((element) => element.remove());
    this.gameOverElements = [];
  }
}

enum ElementType {
  DIV = "div",
  IMG = "img",
}

class ImprovedElementCreator {
  static createElement(
    elementType: ElementType,
    classes?: string | string[],
    size?: [number, number],
    textContent?: string
  ) {
    const element = document.createElement(elementType);
    if (!classes) {
      return element;
    }
    if (typeof classes === "string") {
      element.classList.add(classes);
    } else {
      element.classList.add(...classes);
    }

    if (size) {
      const [width, height] = size;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }

    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  }
}

class BlockElement {
  private readonly name: string;
  private readonly figure: Figure;
  private readonly div: HTMLDivElement;
  private readonly onClick?: (block: BlockElement) => void;
  private readonly clickHandler: (event: Event) => void;

  constructor(
    name: string,
    figure: Figure,
    onClick: (block: BlockElement) => void
  ) {
    this.name = name;
    this.figure = figure;
    this.onClick = onClick;
    this.div = this.createBlock();
    const ref = this;
    this.clickHandler = this.click.bind(ref);
    this.div.addEventListener("click", this.clickHandler);
  }

  private createBlock(): HTMLDivElement {
    const divElement = ImprovedElementCreator.createElement(ElementType.DIV, [
      "block",
      "flip-container",
    ]) as HTMLDivElement;

    const flipper = ImprovedElementCreator.createElement(
      ElementType.DIV,
      "flipper"
    ) as HTMLDivElement;

    const front = ImprovedElementCreator.createElement(
      ElementType.DIV,
      "front"
    ) as HTMLDivElement;
    const back = ImprovedElementCreator.createElement(
      ElementType.DIV,
      "back"
    ) as HTMLDivElement;
    flipper.appendChild(front);
    flipper.appendChild(back);

    divElement.appendChild(flipper);
    return divElement;
  }

  getDivElementRef() {
    return this.div;
  }

  getFigureRef() {
    return this.figure.getImgElementRef();
  }

  click() {
    this.onClick && this.onClick(this);
  }

  open() {
    const back = this.div.querySelector(".back");
    back && back.appendChild(this.figure.getImgElementRef());
    this.div.querySelector(".flipper")?.classList.toggle("flip");
  }

  reset(match: Boolean) {
    const flipper = this.div.querySelector(".flipper");
    const back = this.div.querySelector(".back");

    if (match) {
      this.div.classList.toggle("match");
      this.div.removeEventListener("click", this.clickHandler);
    } else {
      if (flipper && back) {
        flipper.classList.remove("flip");
        this.div.classList.toggle("notMatch");
        setTimeout(() => {
          back.removeChild(this.figure.getImgElementRef());
        }, BLOCK_OPEN_ANIMATION_LENGTH);
      }
    }
  }
}

class Figure {
  private readonly img: HTMLImageElement;

  constructor(link: string) {
    this.img = ImprovedElementCreator.createElement(
      ElementType.IMG
    ) as HTMLImageElement;
    this.img.src = link;
  }

  getImgElementRef() {
    return this.img;
  }
}

class Timer {
  private intervalId: number | null = null;
  private seconds = 0;
  private updateTimeCallback: (timeString: string, color?: string) => void;

  constructor(
    updateTimeCallback: (timeString: string, color?: string) => void
  ) {
    this.updateTimeCallback = updateTimeCallback;
  }

  startTimer(gameLength: number): void {
    this.seconds = gameLength * 60;
    this.updateTime();

    this.intervalId = window.setInterval(() => {
      this.seconds--;

      let color: string | undefined;
      switch (this.seconds) {
        case 59:
          color = "#ffb703";
          break;
        case 30:
          color = "#e63946";
          break;
      }

      this.updateTime(color);

      if (this.seconds <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateTime(color?: string): void {
    const minutes = Math.floor(this.seconds / 60);
    const remainingSeconds = this.seconds % 60;
    const timeString = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
    this.updateTimeCallback(timeString, color);
  }
}

type StatKey = "turnCount" | "matchCount" | "missCount";

class GameStats {
  private turnCount: number = 0;
  private matchCount: number = 0;
  private missCount: number = 0;

  increment(stat: StatKey) {
    this[stat] += 1;
  }

  get(stat: StatKey): number {
    return this[stat];
  }

  resetStats() {
    this.turnCount = 0;
    this.matchCount = 0;
    this.missCount = 0;
  }
}

class GameUI {
  private turnCount: HTMLSpanElement;
  private matchCount: HTMLSpanElement;
  private missCount: HTMLSpanElement;
  private accuracyPercentage: HTMLSpanElement;
  private speedSelector: HTMLSelectElement;

  constructor(onSpeedChange: (newSpeed: number) => void) {
    this.turnCount = document.getElementById("turnCount") as HTMLSpanElement;
    this.matchCount = document.getElementById("matchCount") as HTMLSpanElement;
    this.missCount = document.getElementById("missCount") as HTMLSpanElement;
    this.accuracyPercentage = document.getElementById(
      "accuracyPercentage"
    ) as HTMLSpanElement;
    this.speedSelector = document.getElementById(
      "speedSelect"
    ) as HTMLSelectElement;
    this.speedSelector.addEventListener("change", () => {
      const selectedSpeed = parseInt(this.speedSelector.value);
      onSpeedChange(selectedSpeed);
    });
  }

  updateElementCount(count: string, element: StatKey) {
    this[element].textContent = count;
  }

  updatePercentage(percentage: string) {
    this.accuracyPercentage.textContent = `${percentage.toString()}%`;
  }
}

class Board {
  private readonly blocks: BlockElement[][];
  private readonly container;
  private readonly limit: number;
  private openedBlocks: BlockElement[];
  private readonly boardSize: number;
  private readonly size: number;
  private matchedPairs: number = 0;
  private pairTimerRunning: boolean = false;
  private readonly gameTimeRef: HTMLParagraphElement;
  private readonly timer: Timer;
  private readonly settings: BoardSettings;
  private isGameActive = false;
  private readonly gameStats: GameStats;
  private readonly gameUI: GameUI;

  constructor(settings: BoardSettings) {
    this.gameStats = new GameStats();
    this.gameUI = new GameUI(this.handleSpeedChange.bind(this));
    this.gameTimeRef = document.getElementById(
      "gameTimer"
    ) as HTMLParagraphElement;
    this.timer = new Timer(this.updateTimeDisplay.bind(this));
    this.settings = settings;
    this.size = settings.size;
    this.boardSize = settings.size * settings.size;
    this.container = document.querySelector("#blockContainer")!!;
    this.limit = 2;
    this.openedBlocks = [];
    this.blocks = [];
    document.body.style.backgroundImage =
      "url(./images/backgrounds/containersBgSmaller.jpg)";

    const blocksArray = this.createBlockArray();
    for (let i = 0; i < settings.size; i++) {
      this.blocks[i] = [];
      for (let j = 0; j < settings.size; j++) {
        this.blocks[i][j] = blocksArray[i * settings.size + j];
      }
    }
  }

  private handleSpeedChange(newSpeed: number) {
    this.settings.timeoutSpeed = newSpeed;
  }

  private updateTimeDisplay(timeString: string, color?: string): void {
    this.gameTimeRef.textContent = timeString;
    if (color) {
      this.gameTimeRef.style.color = color;
    }
    if (timeString === "0:00") {
      this.gameOver("timeOut");
    }
  }

  openBlock(block: BlockElement) {
    if (!this.isGameActive || this.pairTimerRunning) {
      return;
    } else if (
      !this.openedBlocks.includes(block) &&
      !(this.openedBlocks.length >= this.limit)
    ) {
      block.open();
      this.openedBlocks.push(block);
    }

    if (this.openedBlocks.length === this.limit) {
      this.updateTurnCount();
      this.pairCheck();
    }
  }

  pairCheck() {
    const firstBlock = this.openedBlocks[0];
    const secondBlock = this.openedBlocks[1];
    const blocksMatch =
      firstBlock.getFigureRef().src === secondBlock.getFigureRef().src;
    this.pairTimerRunning = true;
    const timer = blocksMatch ? 500 : this.settings.timeoutSpeed;

    !blocksMatch &&
      setTimeout(() => {
        this.openedBlocks.forEach((b) =>
          b.getDivElementRef().classList.toggle("notMatch")
        );
      }, BLOCK_OPEN_ANIMATION_LENGTH);
    setTimeout(() => {
      this.updateStats(blocksMatch);
      this.resetPair(blocksMatch);
      this.pairTimerRunning = false;
    }, timer);
  }

  resetPair(blocksMatch: boolean) {
    this.openedBlocks.forEach((b) => b.reset(blocksMatch));
    this.openedBlocks = [];
    if (blocksMatch) {
      this.matchedPairs++;
      if (this.matchedPairs === this.boardSize / 2) {
        this.gameOver("victory");
      }
    }
  }

  updateStats(blocksMatch: boolean) {
    this.gameStats.increment(blocksMatch ? "matchCount" : "missCount");
    this.gameUI.updateElementCount(
      this.gameStats.get("matchCount").toString(),
      "matchCount"
    );
    this.gameUI.updateElementCount(
      this.gameStats.get("missCount").toString(),
      "missCount"
    );

    this.gameUI.updatePercentage(
      (
        (this.gameStats.get("matchCount") / this.gameStats.get("turnCount")) *
        100
      ).toFixed(1)
    );
  }

  private updateTurnCount() {
    this.gameStats.increment("turnCount");
    this.gameUI.updateElementCount(
      this.gameStats.get("turnCount").toString(),
      "turnCount"
    );
  }

  gameOver(src: string) {
    this.timer.stopTimer();
    this.isGameActive = false;
    const gameOverHeadingRef = document.getElementById("gameoverMessage");
    switch (src) {
      case "victory":
        const confettiAnimation = new ConfettiAnimation(
          gameOverHeadingRef as HTMLHeadingElement
        );
        confettiAnimation.start();
        setTimeout(() => confettiAnimation.stop(), ANIMATION_LENGTH);
        break;
      case "timeOut":
        const timeOutAnimation = new TimeOutAnimation(
          gameOverHeadingRef as HTMLHeadingElement
        );
        timeOutAnimation.start();
        setTimeout(() => timeOutAnimation.stop(), ANIMATION_LENGTH);
        break;
      case "quit":
        const baseUrl = window.location.href.split("/").slice(0, -1).join("/");
        window.location.href = baseUrl;
        break;
    }
  }

  createBlockArray(): BlockElement[] {
    let blocksArray = [];
    const addedFields: { [key: string]: number } = {};
    for (let i = 0; i < this.boardSize; i++) {
      const field = fields[0];
      const link = `images/AnimalsNew/${field}.png`;
      const figure = new Figure(link);
      const block = new BlockElement(
        "block",
        figure,
        this.openBlock.bind(this)
      );
      blocksArray.push(block);
      if (addedFields[field] == 1) {
        addedFields[field] = addedFields[field] + 1;
        fields.shift();
      } else {
        addedFields[field] = 1;
      }
    }
    return blocksArray;
    // Uncomment this to return shuffled blocks instead
    //return this.shuffleBlocks(blocksArray);
  }

  shuffleBlocks(blocksArray: BlockElement[]) {
    let currentIndex = blocksArray.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [blocksArray[currentIndex], blocksArray[randomIndex]] = [
        blocksArray[randomIndex],
        blocksArray[currentIndex],
      ];
    }
    return blocksArray;
  }

  draw() {
    for (let i = 0; i < this.blocks.length; i++) {
      const row = ImprovedElementCreator.createElement(ElementType.DIV, "row");
      for (let j = 0; j < this.blocks.length; j++) {
        const block = this.blocks[i][j].getDivElementRef();
        row?.appendChild(block);
      }
      this.container.appendChild(row);
    }
  }
  startGame(gameLength: number): void {
    this.isGameActive = true;
    const quitButtons = document.querySelectorAll(".quit-game");
    quitButtons.forEach((button) => {
      button.addEventListener("click", () => this.gameOver("quit"));
    });
    this.draw();
    this.timer.startTimer(gameLength);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get("gameMode") as Difficulties;
const gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.startGame(DifficultySettings[gameMode].gameLength);
