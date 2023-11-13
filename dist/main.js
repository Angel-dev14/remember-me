import { fields } from "./possibleImages.js";
var Difficulties;
(function (Difficulties) {
    Difficulties["EASY"] = "EASY";
    Difficulties["MEDIUM"] = "MEDIUM";
    Difficulties["HARD"] = "HARD";
})(Difficulties || (Difficulties = {}));
const DifficultySettings = {
    [Difficulties.EASY]: { gameLength: 5, timeoutSpeed: 2000, size: 2 },
    [Difficulties.MEDIUM]: { gameLength: 5, timeoutSpeed: 1500, size: 4 },
    [Difficulties.HARD]: { gameLength: 3, timeoutSpeed: 1000, size: 6 },
};
class Animation {
    constructor(elementRef) {
        this.headingElementRef = elementRef;
    }
}
class ConfettiAnimation extends Animation {
    constructor(headingElementRef) {
        var _a;
        super(headingElementRef);
        this.confettiArray = [];
        this.confettiCount = 200;
        this.parentContainerRef = document.getElementById("gameoverParent");
        (_a = this.parentContainerRef
            .querySelector(".gameover-x-mark")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.parentContainerRef.style.display = "none";
            this.headingElementRef.textContent = "";
        });
    }
    start() {
        for (let i = 0; i < this.confettiCount; i++) {
            const confetti = ImprovedElementCreator.createElement(ElementType.DIV, "confetti", undefined, "🎉");
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
            this.confettiArray.push(confetti);
            document.body.appendChild(confetti);
        }
    }
    stop() {
        this.confettiArray.forEach((confetti) => {
            confetti.remove();
        });
        this.confettiArray = [];
        this.parentContainerRef.style.display = "flex";
        this.headingElementRef.textContent = "You won";
    }
}
var ElementType;
(function (ElementType) {
    ElementType["DIV"] = "div";
    ElementType["IMG"] = "img";
})(ElementType || (ElementType = {}));
class ImprovedElementCreator {
    static createElement(elementType, classes, size, textContent) {
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
        const divElement = ImprovedElementCreator.createElement(ElementType.DIV, ["block", "flip-container"], [100, 100]);
        const flipper = ImprovedElementCreator.createElement(ElementType.DIV, "flipper");
        const front = ImprovedElementCreator.createElement(ElementType.DIV, "front");
        const back = ImprovedElementCreator.createElement(ElementType.DIV, "back");
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
        var _a;
        const back = this.div.querySelector(".back");
        if (back) {
            back.appendChild(this.figure.getImgElementRef());
        }
        (_a = this.div.querySelector(".flipper")) === null || _a === void 0 ? void 0 : _a.classList.toggle("flip");
    }
    reset(match) {
        const flipper = this.div.querySelector(".flipper");
        const back = this.div.querySelector(".back");
        if (match) {
            this.div.style.border = "green 2px solid";
            this.div.removeEventListener("click", this.clickHandler);
        }
        else {
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
    constructor(link) {
        this.img = ImprovedElementCreator.createElement(ElementType.IMG);
        this.img.src = link;
    }
    getImgElementRef() {
        return this.img;
    }
}
class Timer {
    constructor(updateTimeCallback) {
        this.intervalId = null;
        this.seconds = 0;
        this.updateTimeCallback = updateTimeCallback;
    }
    startTimer(gameLength) {
        this.seconds = gameLength * 60;
        this.updateTime();
        this.intervalId = window.setInterval(() => {
            this.seconds--;
            let color;
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
    stopTimer() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    updateTime(color) {
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        const timeString = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
        this.updateTimeCallback(timeString, color);
    }
}
class Board {
    constructor(settings) {
        this.matchedPairs = 0;
        this.pairTimerRunning = false;
        this.gameTimeRef = document.getElementById("gameTimer");
        this.timer = new Timer(this.updateTimeDisplay.bind(this));
        this.settings = settings;
        this.size = settings.size;
        this.boardSize = settings.size * settings.size;
        this.container = document.querySelector(".container");
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
    updateTimeDisplay(timeString, color) {
        // Update your time display element here
        this.gameTimeRef.textContent = timeString;
        if (color) {
            this.gameTimeRef.style.color = color;
        }
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
        this.timer.stopTimer();
        const gameOverHeadingRef = document.getElementById("gameoverMessage");
        const confettiAnimation = new ConfettiAnimation(gameOverHeadingRef);
        confettiAnimation.start();
        setTimeout(() => confettiAnimation.stop(), 6000);
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
    startGame(gameLength) {
        this.timer.startTimer(gameLength);
    }
}
const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get("gameMode");
const gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.draw();
gameBoard.startGame(DifficultySettings[gameMode].gameLength);
//# sourceMappingURL=main.js.map