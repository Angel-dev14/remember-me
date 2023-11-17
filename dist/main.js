import { fields } from "./possibleImages.js";
import { SoundPlayer } from "./start.js";
const ANIMATION_LENGTH = 6000;
const BLOCK_OPEN_ANIMATION_LENGTH = 600;
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
        var _a;
        this.headingElementRef = elementRef;
        this.parentContainerRef = document.getElementById("gameoverParent");
        (_a = this.parentContainerRef
            .querySelector(".gameover-x-mark")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.parentContainerRef.style.display = "none";
            this.headingElementRef.textContent = "";
        });
    }
    animateElements(emoji, finalMessage, count) {
        const elementsArray = [];
        for (let i = 0; i < count; i++) {
            const element = ImprovedElementCreator.createElement(ElementType.DIV, "game-over-fall", undefined, emoji);
            element.style.left = `${Math.random() * 100}vw`;
            element.style.animationDuration = `${Math.random() * 2 + 3}s`;
            elementsArray.push(element);
            document.body.appendChild(element);
        }
        setTimeout(() => {
            var _a;
            this.parentContainerRef.style.display = "flex";
            this.headingElementRef.textContent = finalMessage;
            (_a = this.parentContainerRef
                .querySelector(".reset-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                localStorage.setItem("playStartSound", "true");
                location.reload();
            });
        }, ANIMATION_LENGTH);
        return elementsArray;
    }
    clearElements(elementsArray) {
        elementsArray.forEach((element) => element.remove());
        elementsArray.length = 0;
    }
}
class ConfettiAnimation extends Animation {
    constructor(headingElementRef) {
        super(headingElementRef);
        this.confettiArray = [];
        this.confettiCount = 200;
    }
    start() {
        this.confettiArray = this.animateElements("🎉", "You won", this.confettiCount);
    }
    stop() {
        this.clearElements(this.confettiArray);
    }
}
class TimeOutAnimation extends Animation {
    constructor(headingElementRef) {
        super(headingElementRef);
        this.gameOverElements = [];
        this.clockCount = 200;
    }
    start() {
        this.gameOverElements = this.animateElements("⏰", "Time's Up!", this.clockCount);
    }
    stop() {
        this.clearElements(this.gameOverElements);
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
    constructor(name, figure, onClick) {
        this.name = name;
        this.figure = figure;
        this.onClick = onClick;
        this.div = this.createBlock();
        const ref = this;
        this.clickHandler = this.click.bind(ref);
        this.div.addEventListener("click", this.clickHandler);
    }
    createBlock() {
        const divElement = ImprovedElementCreator.createElement(ElementType.DIV, [
            "block",
            "flip-container",
        ]);
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
        back && back.appendChild(this.figure.getImgElementRef());
        (_a = this.div.querySelector(".flipper")) === null || _a === void 0 ? void 0 : _a.classList.toggle("flip");
    }
    reset(match) {
        const flipper = this.div.querySelector(".flipper");
        const back = this.div.querySelector(".back");
        if (match) {
            this.div.classList.toggle("match");
            this.div.removeEventListener("click", this.clickHandler);
        }
        else {
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
class GameStats {
    constructor() {
        this.turnCount = 0;
        this.matchCount = 0;
        this.missCount = 0;
    }
    increment(stat) {
        this[stat] += 1;
    }
    get(stat) {
        return this[stat];
    }
    resetStats() {
        this.turnCount = 0;
        this.matchCount = 0;
        this.missCount = 0;
    }
}
class GameUI {
    constructor(onSpeedChange) {
        this.turnCount = this.getElement("turnCount");
        this.matchCount = this.getElement("matchCount");
        this.missCount = this.getElement("missCount");
        this.accuracyPercentage = this.getElement("accuracyPercentage");
        this.speedSelector = this.getElement("speedSelect");
        this.backgroundCheckbox = this.getElement("showOnlyNumbers");
        this.setupEventListener(this.speedSelector, "change", () => {
            const selectedSpeed = parseInt(this.speedSelector.value);
            onSpeedChange(selectedSpeed);
        });
        this.setupEventListener(this.backgroundCheckbox, "change", () => {
            const parentElement = this.getElement("blockContainer");
            const blocks = parentElement.querySelectorAll(".front");
            blocks.forEach((block, index) => {
                if (this.backgroundCheckbox.checked) {
                    block.textContent = (index + 1).toString(); // Adds a number to each block
                    block.classList.add("big-number");
                }
                else {
                    block.textContent = ""; // Reset the text content
                    block.classList.remove("big-number");
                }
            });
            parentElement.classList.toggle("no-background");
        });
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element)
            throw new Error(`Element with id '${id}' not found`);
        return element;
    }
    setupEventListener(element, event, handler) {
        element.addEventListener(event, handler);
    }
    updateElementCount(count, element) {
        this[element].textContent = count;
    }
    updatePercentage(percentage) {
        this.accuracyPercentage.textContent = `${percentage.toString()}%`;
    }
    changeBackground(blockArray) {
        blockArray.forEach((block) => {
            block.getDivElementRef().classList.toggle("showOnlyNumbers");
        });
    }
}
class Board {
    constructor(settings) {
        this.matchedPairs = 0;
        this.pairTimerRunning = false;
        this.isGameActive = false;
        this.gameStats = new GameStats();
        this.gameUI = new GameUI(this.handleSpeedChange.bind(this));
        this.gameTimeRef = document.getElementById("gameTimer");
        this.timer = new Timer(this.updateTimeDisplay.bind(this));
        this.settings = settings;
        this.size = settings.size;
        this.boardSize = settings.size * settings.size;
        this.container = document.querySelector("#blockContainer");
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
    handleSpeedChange(newSpeed) {
        this.settings.timeoutSpeed = newSpeed;
    }
    updateTimeDisplay(timeString, color) {
        this.gameTimeRef.textContent = timeString;
        if (color) {
            this.gameTimeRef.style.color = color;
        }
        if (timeString === "0:00") {
            this.gameOver("timeOut");
        }
    }
    openBlock(block) {
        if (!this.isGameActive || this.pairTimerRunning) {
            return;
        }
        else if (!this.openedBlocks.includes(block) &&
            !(this.openedBlocks.length >= this.limit)) {
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
        const blocksMatch = firstBlock.getFigureRef().src === secondBlock.getFigureRef().src;
        this.pairTimerRunning = true;
        const timer = blocksMatch ? 500 : this.settings.timeoutSpeed;
        SoundPlayer.playSound(blocksMatch ? "SUCCESS" : "FAILURE");
        !blocksMatch &&
            setTimeout(() => {
                this.openedBlocks.forEach((b) => b.getDivElementRef().classList.toggle("notMatch"));
            }, BLOCK_OPEN_ANIMATION_LENGTH);
        setTimeout(() => {
            this.updateStats(blocksMatch);
            this.resetPair(blocksMatch);
        }, timer);
    }
    resetPair(blocksMatch) {
        this.openedBlocks.forEach((b) => b.reset(blocksMatch));
        this.openedBlocks = [];
        if (blocksMatch) {
            this.matchedPairs++;
            if (this.matchedPairs === this.boardSize / 2) {
                this.gameOver("victory");
            }
        }
        setTimeout(() => {
            this.pairTimerRunning = false;
        }, BLOCK_OPEN_ANIMATION_LENGTH);
    }
    updateStats(blocksMatch) {
        this.gameStats.increment(blocksMatch ? "matchCount" : "missCount");
        this.gameUI.updateElementCount(this.gameStats.get("matchCount").toString(), "matchCount");
        this.gameUI.updateElementCount(this.gameStats.get("missCount").toString(), "missCount");
        this.gameUI.updatePercentage(((this.gameStats.get("matchCount") / this.gameStats.get("turnCount")) *
            100).toFixed(1));
    }
    updateTurnCount() {
        this.gameStats.increment("turnCount");
        this.gameUI.updateElementCount(this.gameStats.get("turnCount").toString(), "turnCount");
    }
    gameOver(src) {
        this.timer.stopTimer();
        this.isGameActive = false;
        const gameOverHeadingRef = document.getElementById("gameoverMessage");
        switch (src) {
            case "victory":
                SoundPlayer.playSound("VICTORY", 2);
                const confettiAnimation = new ConfettiAnimation(gameOverHeadingRef);
                confettiAnimation.start();
                setTimeout(() => {
                    confettiAnimation.stop();
                }, ANIMATION_LENGTH);
                break;
            case "timeOut":
                SoundPlayer.playSound("DEFEAT", 2);
                const timeOutAnimation = new TimeOutAnimation(gameOverHeadingRef);
                timeOutAnimation.start();
                setTimeout(() => timeOutAnimation.stop(), ANIMATION_LENGTH);
                break;
            case "quit":
                const baseUrl = window.location.href.split("/").slice(0, -1).join("/");
                window.location.href = baseUrl;
                break;
        }
    }
    createBlockArray() {
        let blocksArray = [];
        const addedFields = {};
        for (let i = 0; i < this.boardSize; i++) {
            const field = fields[0];
            const link = `images/AnimalsNew/${field}.png`;
            const figure = new Figure(link);
            const block = new BlockElement("block", figure, this.openBlock.bind(this));
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
    startGame() {
        this.isGameActive = true;
        const quitButtons = document.querySelectorAll(".quit-game");
        quitButtons.forEach((button) => {
            button.addEventListener("click", () => this.gameOver("quit"));
        });
        this.draw();
        this.timer.startTimer(this.settings.gameLength);
        document.addEventListener("DOMContentLoaded", () => {
            if (localStorage.getItem("playStartSound") === "true") {
                SoundPlayer.playSound("START");
                localStorage.removeItem("playStartSound");
            }
            SoundPlayer.playSound("GAME_MUSIC", -1);
        });
    }
}
const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get("gameMode");
const gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.startGame();
//# sourceMappingURL=main.js.map