import { fields } from "./possibleImages.js";

type BoardSettings = {
  timer: number;
  timeoutSpeed: number;
  size: number;
};

enum Difficulties {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

abstract class Animation {
  protected elementRef: HTMLElement;

  protected constructor(elementRef: HTMLElement) {
    this.elementRef = elementRef;
  }

  abstract start(): void;

  abstract stop(): void;
}

class ConfettiAnimation extends Animation {
  private confettiArray: HTMLElement[] = [];
  private confettiCount = 200;

  constructor(headingElementRef: HTMLElement) {
    super(headingElementRef);
  }

  start() {
    for (let i = 0; i < this.confettiCount; i++) {
      const confetti = ImprovedElementCreator.createElement(
        ElementType.DIV,
        "confetti",
        undefined,
        "🎉"
      ) as HTMLDivElement;
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
      this.confettiArray.push(confetti);
      document.body.appendChild(confetti);
      this.elementRef.textContent = "You Won";
    }
  }

  stop() {
    this.elementRef.textContent = "";
    this.confettiArray.forEach((confetti) => {
      confetti.remove();
    });
    this.confettiArray = [];
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
    size?: [number, number ],
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
  private readonly width: number;
  private readonly height: number;
  private readonly figure: Figure;
  private readonly div: HTMLDivElement;
  private readonly onClick?: (block: BlockElement) => void;
  private readonly clickHandler: (event: Event) => void;

  constructor(
    name: string,
    width: number,
    height: number,
    figure: Figure,
    onClick: (block: BlockElement) => void
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.figure = figure;
    this.onClick = onClick;
    this.div = this.createBlock();
    const ref = this;
    this.clickHandler = this.click.bind(ref);
    this.div.addEventListener("click", this.clickHandler);
  }

  private createBlock(): HTMLDivElement {
    const divElement = ImprovedElementCreator.createElement(
      ElementType.DIV,
      ["block", "flip-container"],
      [100, 100]
    ) as HTMLDivElement;

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
    if (back) {
      back.appendChild(this.figure.getImgElementRef());
    }
    this.div.querySelector(".flipper")?.classList.toggle("flip");
  }

  reset(match: Boolean) {
    const flipper = this.div.querySelector(".flipper");
    const back = this.div.querySelector(".back");

    if (match) {
      this.div.style.border = "green 2px solid";
      this.div.removeEventListener("click", this.clickHandler);
    } else {
      if (flipper && back) {
        flipper.classList.remove("flip");
        setTimeout(() => {
          back.removeChild(this.figure.getImgElementRef());
        }, 600);
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

class Board {
  private readonly blocks: BlockElement[][];
  private readonly container;
  private limit: number;
  private openedBlocks: BlockElement[];
  private boardSize: number;
  private size: number;
  private matchedPairs: number = 0;
  private pairTimerRunning: boolean = false;
  private gameTimeRef: HTMLParagraphElement;
  private settings: BoardSettings;

  constructor(settings: BoardSettings) {
    this.gameTimeRef = document.getElementById(
      "gameTimer"
    ) as HTMLParagraphElement;
    this.settings = settings;
    this.size = settings.size;
    this.boardSize = settings.size * settings.size;
    this.container = document.querySelector(".container")!!;
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
    this.startTimer(settings.timer);
  }

  startTimer(timer: number) {
    // This should be a class perhaps, to handle Timers
    let seconds = timer * 60; // Convert minutes to seconds
    this.gameTimeRef.textContent = `${timer}:00`;

    const intervalId = setInterval(() => {
      seconds--;

      switch (seconds) {
        case 59:
          this.gameTimeRef.style.color = "#ffb703";
          break;
        case 30:
          this.gameTimeRef.style.color = "#e63946";
          break;
      }

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      this.gameTimeRef.textContent = `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;

      if (seconds <= 0) {
        clearInterval(intervalId); // Stop the timer when it reaches 0
      }
    }, 1000);
  }

  openBlock(block: BlockElement) {
    if (this.pairTimerRunning) {
      return;
    } else if (
      !this.openedBlocks.includes(block) &&
      !(this.openedBlocks.length >= this.limit)
    ) {
      block.open();
      this.openedBlocks.push(block);
    }

    if (this.openedBlocks.length === this.limit) {
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
    setTimeout(() => {
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
        this.gameOver();
      }
    }
  }

  gameOver() {
    const gameOverHeadingRef = document.getElementById("gameoverMessage");
    const confettiAnimation = new ConfettiAnimation(
      gameOverHeadingRef as HTMLHeadingElement
    );
    confettiAnimation.start();
    // TODO clear
    setTimeout(() => confettiAnimation.stop(), 6000);
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
        100,
        100,
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
}

const DifficultySettings: {
  [key in Difficulties]: { timer: number; timeoutSpeed: number; size: number };
} = {
  [Difficulties.EASY]: { timer: 5, timeoutSpeed: 2000, size: 2 },
  [Difficulties.MEDIUM]: { timer: 5, timeoutSpeed: 1500, size: 4 },
  [Difficulties.HARD]: { timer: 3, timeoutSpeed: 1000, size: 6 },
};

const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get("gameMode") as Difficulties;
const gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.draw();
