import { fields } from "./possibleImages.js";
var Difficulties;
(function (Difficulties) {
    Difficulties["EASY"] = "EASY";
    Difficulties["MEDIUM"] = "MEDIUM";
    Difficulties["HARD"] = "HARD";
})(Difficulties || (Difficulties = {}));
class Animation {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
}
class ConfettiAnimation extends Animation {
    constructor(headingElementRef) {
        super(headingElementRef);
        this.confettiArray = [];
        this.confettiCount = 200;
    }
    start() {
        for (let i = 0; i < this.confettiCount; i++) {
            const confetti = ImprovedElementCreator.createElement(ElementType.DIV);
            confetti.classList.add("confetti");
            confetti.textContent = "🎉";
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
var ElementType;
(function (ElementType) {
    ElementType["DIV"] = "div";
    ElementType["IMG"] = "img";
})(ElementType || (ElementType = {}));
class ImprovedElementCreator {
    static createElement(elementType, classes) {
        const element = document.createElement(elementType);
        if (!classes) {
            return element;
        }
        if (typeof classes === "string") {
            element.classList.add(classes);
        }
        else {
            element.classList.add(...classes);
        }
        return element;
    }
}
class BlockElement {
    constructor(name, width, height, figure, onClick) {
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
    createBlock() {
        const divElement = ImprovedElementCreator.createElement(ElementType.DIV);
        divElement.style.width = `${this.width}px`;
        divElement.style.height = `${this.width}px`;
        divElement.classList.add("block");
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
        this.div.appendChild(this.figure.getImgElementRef());
        const animationEndCallback = () => {
            //TODO Flip animation
            // this.div.classList.remove("flip");
            this.div.removeEventListener("animationend", animationEndCallback);
        };
        // this.div.classList.add("flip");
        this.div.addEventListener("animationend", animationEndCallback);
    }
    reset(match) {
        if (match) {
            this.div.style.border = "green 2px solid";
            this.div.removeEventListener("click", this.clickHandler);
        }
        else {
            this.div.removeChild(this.figure.getImgElementRef());
        }
    }
}
class Figure {
    constructor(link) {
        this.img = ImprovedElementCreator.createElement(ElementType.IMG);
        this.img.src = link;
        this.img.style.width = "inherit";
        this.img.style.height = "inherit";
    }
    getImgElementRef() {
        return this.img;
    }
}
class Board {
    constructor(settings) {
        this.matchedPairs = 0;
        this.pairTimerRunning = false;
        this.gameTimeRef = document.getElementById("gameTimer");
        this.settings = settings;
        this.size = settings.size;
        this.boardSize = settings.size * settings.size;
        this.container = document.querySelector(".container");
        this.limit = 2;
        this.openedBlocks = [];
        this.blocks = [];
        document.body.style.backgroundImage = "url(./images/backgrounds/containersBgSmaller.jpg)";
        const blocksArray = this.createBlockArray();
        for (let i = 0; i < settings.size; i++) {
            this.blocks[i] = [];
            for (let j = 0; j < settings.size; j++) {
                this.blocks[i][j] = blocksArray[i * settings.size + j];
            }
        }
        this.startTimer(settings.timer);
    }
    startTimer(timer) {
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
            this.gameTimeRef.textContent = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
            if (seconds <= 0) {
                clearInterval(intervalId); // Stop the timer when it reaches 0
            }
        }, 1000);
    }
    openBlock(block) {
        if (this.pairTimerRunning) {
            return;
        }
        else if (!this.openedBlocks.includes(block) &&
            !(this.openedBlocks.length >= this.limit)) {
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
        const blocksMatch = firstBlock.getFigureRef().src === secondBlock.getFigureRef().src;
        this.pairTimerRunning = true;
        const timer = blocksMatch ? 500 : this.settings.timeoutSpeed;
        setTimeout(() => {
            this.resetPair(blocksMatch);
            this.pairTimerRunning = false;
        }, timer);
    }
    resetPair(blocksMatch) {
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
        const confettiAnimation = new ConfettiAnimation(gameOverHeadingRef);
        confettiAnimation.start();
        // TODO clear
        setTimeout(() => confettiAnimation.stop(), 5000);
    }
    createBlockArray() {
        let blocksArray = [];
        const addedFields = {};
        for (let i = 0; i < this.boardSize; i++) {
            const field = fields[0];
            const link = `images/AnimalsNew/${field}.png`;
            const figure = new Figure(link);
            const block = new BlockElement("block", 100, 100, figure, this.openBlock.bind(this));
            blocksArray.push(block);
            if (addedFields[field] == 1) {
                addedFields[field] = addedFields[field] + 1;
                fields.shift();
            }
            else {
                addedFields[field] = 1;
            }
        }
        return blocksArray;
        // Uncomment this to return shuffled blocks instead
        //return this.shuffleBlocks(blocksArray);
    }
    shuffleBlocks(blocksArray) {
        let currentIndex = blocksArray.length, randomIndex;
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
                row === null || row === void 0 ? void 0 : row.appendChild(block);
            }
            this.container.appendChild(row);
        }
    }
}
const DifficultySettings = {
    [Difficulties.EASY]: { timer: 5, timeoutSpeed: 2000, size: 2 },
    [Difficulties.MEDIUM]: { timer: 5, timeoutSpeed: 1500, size: 4 },
    [Difficulties.HARD]: { timer: 3, timeoutSpeed: 1000, size: 6 },
};
const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get("gameMode");
const gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.draw();
//# sourceMappingURL=main.js.map