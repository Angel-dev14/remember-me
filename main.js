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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var possibleImages_js_1 = require("./possibleImages.js");
var start_js_1 = require("./start.js");
var ANIMATION_LENGTH = 6000;
var BLOCK_OPEN_ANIMATION_LENGTH = 600;
var Difficulties;
(function (Difficulties) {
    Difficulties["EASY"] = "EASY";
    Difficulties["MEDIUM"] = "MEDIUM";
    Difficulties["HARD"] = "HARD";
})(Difficulties || (Difficulties = {}));
var DifficultySettings = (_a = {},
    _a[Difficulties.EASY] = { gameLength: 5, timeoutSpeed: 2000, size: 2 },
    _a[Difficulties.MEDIUM] = { gameLength: 5, timeoutSpeed: 1500, size: 4 },
    _a[Difficulties.HARD] = { gameLength: 3, timeoutSpeed: 1000, size: 6 },
    _a);
var Animation = /** @class */ (function () {
    function Animation(elementRef) {
        var _this = this;
        var _a;
        this.headingElementRef = elementRef;
        this.parentContainerRef = document.getElementById("gameoverParent");
        (_a = this.parentContainerRef
            .querySelector(".gameover-x-mark")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            _this.parentContainerRef.style.display = "none";
            _this.headingElementRef.textContent = "";
        });
    }
    Animation.prototype.animateElements = function (emoji, finalMessage, count) {
        var _this = this;
        var elementsArray = [];
        for (var i = 0; i < count; i++) {
            var element = ImprovedElementCreator.createElement(ElementType.DIV, "game-over-fall", undefined, emoji);
            element.style.left = "".concat(Math.random() * 100, "vw");
            element.style.animationDuration = "".concat(Math.random() * 2 + 3, "s");
            elementsArray.push(element);
            document.body.appendChild(element);
        }
        setTimeout(function () {
            var _a;
            _this.parentContainerRef.style.display = "flex";
            _this.headingElementRef.textContent = finalMessage;
            (_a = _this.parentContainerRef
                .querySelector(".reset-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                localStorage.setItem("playStartSound", "true");
                location.reload();
            });
        }, ANIMATION_LENGTH);
        return elementsArray;
    };
    Animation.prototype.clearElements = function (elementsArray) {
        elementsArray.forEach(function (element) { return element.remove(); });
        elementsArray.length = 0;
    };
    return Animation;
}());
var ConfettiAnimation = /** @class */ (function (_super) {
    __extends(ConfettiAnimation, _super);
    function ConfettiAnimation(headingElementRef) {
        var _this = _super.call(this, headingElementRef) || this;
        _this.confettiArray = [];
        _this.confettiCount = 200;
        return _this;
    }
    ConfettiAnimation.prototype.start = function () {
        this.confettiArray = this.animateElements("🎉", "You won", this.confettiCount);
    };
    ConfettiAnimation.prototype.stop = function () {
        this.clearElements(this.confettiArray);
    };
    return ConfettiAnimation;
}(Animation));
var TimeOutAnimation = /** @class */ (function (_super) {
    __extends(TimeOutAnimation, _super);
    function TimeOutAnimation(headingElementRef) {
        var _this = _super.call(this, headingElementRef) || this;
        _this.gameOverElements = [];
        _this.clockCount = 200;
        return _this;
    }
    TimeOutAnimation.prototype.start = function () {
        this.gameOverElements = this.animateElements("⏰", "Time's Up!", this.clockCount);
    };
    TimeOutAnimation.prototype.stop = function () {
        this.clearElements(this.gameOverElements);
    };
    return TimeOutAnimation;
}(Animation));
var ElementType;
(function (ElementType) {
    ElementType["DIV"] = "div";
    ElementType["IMG"] = "img";
})(ElementType || (ElementType = {}));
var ImprovedElementCreator = /** @class */ (function () {
    function ImprovedElementCreator() {
    }
    ImprovedElementCreator.createElement = function (elementType, classes, size, textContent) {
        var _a;
        var element = document.createElement(elementType);
        if (!classes) {
            return element;
        }
        if (typeof classes === "string") {
            element.classList.add(classes);
        }
        else {
            (_a = element.classList).add.apply(_a, classes);
        }
        if (size) {
            var width = size[0], height = size[1];
            element.style.width = "".concat(width, "px");
            element.style.height = "".concat(height, "px");
        }
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    };
    return ImprovedElementCreator;
}());
var BlockElement = /** @class */ (function () {
    function BlockElement(name, figure, onClick) {
        this.name = name;
        this.figure = figure;
        this.onClick = onClick;
        this.div = this.createBlock();
        var ref = this;
        this.clickHandler = this.click.bind(ref);
        this.div.addEventListener("click", this.clickHandler);
    }
    BlockElement.prototype.createBlock = function () {
        var divElement = ImprovedElementCreator.createElement(ElementType.DIV, [
            "block",
            "flip-container",
        ]);
        var flipper = ImprovedElementCreator.createElement(ElementType.DIV, "flipper");
        var front = ImprovedElementCreator.createElement(ElementType.DIV, "front");
        var back = ImprovedElementCreator.createElement(ElementType.DIV, "back");
        flipper.appendChild(front);
        flipper.appendChild(back);
        divElement.appendChild(flipper);
        return divElement;
    };
    BlockElement.prototype.getDivElementRef = function () {
        return this.div;
    };
    BlockElement.prototype.getFigureRef = function () {
        return this.figure.getImgElementRef();
    };
    BlockElement.prototype.click = function () {
        this.onClick && this.onClick(this);
    };
    BlockElement.prototype.open = function () {
        var _a;
        var back = this.div.querySelector(".back");
        back && back.appendChild(this.figure.getImgElementRef());
        (_a = this.div.querySelector(".flipper")) === null || _a === void 0 ? void 0 : _a.classList.toggle("flip");
    };
    BlockElement.prototype.reset = function (match) {
        var _this = this;
        var flipper = this.div.querySelector(".flipper");
        var back = this.div.querySelector(".back");
        if (match) {
            this.div.classList.toggle("match");
            this.div.removeEventListener("click", this.clickHandler);
        }
        else {
            if (flipper && back) {
                flipper.classList.remove("flip");
                this.div.classList.toggle("notMatch");
                setTimeout(function () {
                    back.removeChild(_this.figure.getImgElementRef());
                }, BLOCK_OPEN_ANIMATION_LENGTH);
            }
        }
    };
    return BlockElement;
}());
var Figure = /** @class */ (function () {
    function Figure(link) {
        this.img = ImprovedElementCreator.createElement(ElementType.IMG);
        this.img.src = link;
    }
    Figure.prototype.getImgElementRef = function () {
        return this.img;
    };
    return Figure;
}());
var Timer = /** @class */ (function () {
    function Timer(updateTimeCallback) {
        this.intervalId = null;
        this.seconds = 0;
        this.updateTimeCallback = updateTimeCallback;
    }
    Timer.prototype.startTimer = function (gameLength) {
        var _this = this;
        this.seconds = gameLength * 60;
        this.updateTime();
        this.intervalId = window.setInterval(function () {
            _this.seconds--;
            var color;
            switch (_this.seconds) {
                case 59:
                    color = "#ffb703";
                    break;
                case 30:
                    color = "#e63946";
                    break;
            }
            _this.updateTime(color);
            if (_this.seconds <= 0) {
                _this.stopTimer();
            }
        }, 1000);
    };
    Timer.prototype.stopTimer = function () {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };
    Timer.prototype.updateTime = function (color) {
        var minutes = Math.floor(this.seconds / 60);
        var remainingSeconds = this.seconds % 60;
        var timeString = "".concat(minutes, ":").concat(remainingSeconds < 10 ? "0" : "").concat(remainingSeconds);
        this.updateTimeCallback(timeString, color);
    };
    return Timer;
}());
var GameStats = /** @class */ (function () {
    function GameStats() {
        this.turnCount = 0;
        this.matchCount = 0;
        this.missCount = 0;
    }
    GameStats.prototype.increment = function (stat) {
        this[stat] += 1;
    };
    GameStats.prototype.get = function (stat) {
        return this[stat];
    };
    GameStats.prototype.resetStats = function () {
        this.turnCount = 0;
        this.matchCount = 0;
        this.missCount = 0;
    };
    return GameStats;
}());
var GameUI = /** @class */ (function () {
    function GameUI(onSpeedChange) {
        var _this = this;
        this.turnCount = this.getElement("turnCount");
        this.matchCount = this.getElement("matchCount");
        this.missCount = this.getElement("missCount");
        this.accuracyPercentage = this.getElement("accuracyPercentage");
        this.speedSelector = this.getElement("speedSelect");
        this.backgroundCheckbox = this.getElement("showOnlyNumbers");
        this.setupEventListener(this.speedSelector, "change", function () {
            var selectedSpeed = parseInt(_this.speedSelector.value);
            onSpeedChange(selectedSpeed);
        });
        this.setupEventListener(this.backgroundCheckbox, "change", function () {
            var parentElement = _this.getElement("blockContainer");
            var blocks = parentElement.querySelectorAll(".front");
            blocks.forEach(function (block, index) {
                if (_this.backgroundCheckbox.checked) {
                    block.textContent = (index + 1).toString();
                    block.classList.add("big-number");
                }
                else {
                    block.textContent = "";
                    block.classList.remove("big-number");
                }
            });
            parentElement.classList.toggle("no-background");
        });
    }
    GameUI.prototype.getElement = function (id) {
        var element = document.getElementById(id);
        if (!element)
            throw new Error("Element with id '".concat(id, "' not found"));
        return element;
    };
    GameUI.prototype.setupEventListener = function (element, event, handler) {
        element.addEventListener(event, handler);
    };
    GameUI.prototype.updateElementCount = function (count, element) {
        this[element].textContent = count;
    };
    GameUI.prototype.updatePercentage = function (percentage) {
        this.accuracyPercentage.textContent = "".concat(percentage.toString(), "%");
    };
    return GameUI;
}());
var Board = /** @class */ (function () {
    function Board(settings) {
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
        var blocksArray = this.createBlockArray();
        for (var i = 0; i < settings.size; i++) {
            this.blocks[i] = [];
            for (var j = 0; j < settings.size; j++) {
                this.blocks[i][j] = blocksArray[i * settings.size + j];
            }
        }
    }
    Board.prototype.handleSpeedChange = function (newSpeed) {
        this.settings.timeoutSpeed = newSpeed;
    };
    Board.prototype.updateTimeDisplay = function (timeString, color) {
        this.gameTimeRef.textContent = timeString;
        if (color) {
            this.gameTimeRef.style.color = color;
        }
        if (timeString === "0:00") {
            this.gameOver("timeOut");
        }
    };
    Board.prototype.openBlock = function (block) {
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
    };
    Board.prototype.pairCheck = function () {
        var _this = this;
        var firstBlock = this.openedBlocks[0];
        var secondBlock = this.openedBlocks[1];
        var blocksMatch = firstBlock.getFigureRef().src === secondBlock.getFigureRef().src;
        this.pairTimerRunning = true;
        var timer = blocksMatch ? 500 : this.settings.timeoutSpeed;
        start_js_1.SoundPlayer.playSound(blocksMatch ? "SUCCESS" : "FAILURE");
        !blocksMatch &&
            setTimeout(function () {
                _this.openedBlocks.forEach(function (b) {
                    return b.getDivElementRef().classList.toggle("notMatch");
                });
            }, BLOCK_OPEN_ANIMATION_LENGTH);
        setTimeout(function () {
            _this.updateStats(blocksMatch);
            _this.resetPair(blocksMatch);
        }, timer);
    };
    Board.prototype.resetPair = function (blocksMatch) {
        var _this = this;
        this.openedBlocks.forEach(function (b) { return b.reset(blocksMatch); });
        this.openedBlocks = [];
        if (blocksMatch) {
            this.matchedPairs++;
            if (this.matchedPairs === this.boardSize / 2) {
                this.gameOver("victory");
            }
        }
        setTimeout(function () {
            _this.pairTimerRunning = false;
        }, BLOCK_OPEN_ANIMATION_LENGTH);
    };
    Board.prototype.updateStats = function (blocksMatch) {
        this.gameStats.increment(blocksMatch ? "matchCount" : "missCount");
        this.gameUI.updateElementCount(this.gameStats.get("matchCount").toString(), "matchCount");
        this.gameUI.updateElementCount(this.gameStats.get("missCount").toString(), "missCount");
        this.gameUI.updatePercentage(((this.gameStats.get("matchCount") / this.gameStats.get("turnCount")) *
            100).toFixed(1));
    };
    Board.prototype.updateTurnCount = function () {
        this.gameStats.increment("turnCount");
        this.gameUI.updateElementCount(this.gameStats.get("turnCount").toString(), "turnCount");
    };
    Board.prototype.gameOver = function (src) {
        this.timer.stopTimer();
        this.isGameActive = false;
        var gameOverHeadingRef = document.getElementById("gameoverMessage");
        switch (src) {
            case "victory":
                start_js_1.SoundPlayer.playSound("VICTORY", 2);
                var confettiAnimation_1 = new ConfettiAnimation(gameOverHeadingRef);
                confettiAnimation_1.start();
                setTimeout(function () {
                    confettiAnimation_1.stop();
                }, ANIMATION_LENGTH);
                break;
            case "timeOut":
                start_js_1.SoundPlayer.playSound("DEFEAT", 2);
                var timeOutAnimation_1 = new TimeOutAnimation(gameOverHeadingRef);
                timeOutAnimation_1.start();
                setTimeout(function () { return timeOutAnimation_1.stop(); }, ANIMATION_LENGTH);
                break;
            case "quit":
                var baseUrl = window.location.href.split("/").slice(0, -1).join("/");
                window.location.href = baseUrl;
                break;
        }
    };
    Board.prototype.createBlockArray = function () {
        var blocksArray = [];
        var addedFields = {};
        for (var i = 0; i < this.boardSize; i++) {
            var field = possibleImages_js_1.fields[0];
            var link = "images/AnimalsNew/".concat(field, ".png");
            var figure = new Figure(link);
            var block = new BlockElement("block", figure, this.openBlock.bind(this));
            blocksArray.push(block);
            if (addedFields[field] == 1) {
                addedFields[field] = addedFields[field] + 1;
                possibleImages_js_1.fields.shift();
            }
            else {
                addedFields[field] = 1;
            }
        }
        return blocksArray;
        // Uncomment this to return shuffled blocks instead
        //return this.shuffleBlocks(blocksArray);
    };
    Board.prototype.shuffleBlocks = function (blocksArray) {
        var _a;
        var currentIndex = blocksArray.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            _a = [
                blocksArray[randomIndex],
                blocksArray[currentIndex],
            ], blocksArray[currentIndex] = _a[0], blocksArray[randomIndex] = _a[1];
        }
        return blocksArray;
    };
    Board.prototype.draw = function () {
        for (var i = 0; i < this.blocks.length; i++) {
            var row = ImprovedElementCreator.createElement(ElementType.DIV, "row");
            for (var j = 0; j < this.blocks.length; j++) {
                var block = this.blocks[i][j].getDivElementRef();
                row === null || row === void 0 ? void 0 : row.appendChild(block);
            }
            this.container.appendChild(row);
        }
    };
    Board.prototype.startGame = function () {
        var _this = this;
        this.isGameActive = true;
        var quitButtons = document.querySelectorAll(".quit-game");
        quitButtons.forEach(function (button) {
            button.addEventListener("click", function () { return _this.gameOver("quit"); });
        });
        this.draw();
        this.timer.startTimer(this.settings.gameLength);
        document.addEventListener("DOMContentLoaded", function () {
            if (localStorage.getItem("playStartSound") === "true") {
                start_js_1.SoundPlayer.playSound("START");
                localStorage.removeItem("playStartSound");
            }
            start_js_1.SoundPlayer.playSound("GAME_MUSIC", -1);
        });
    };
    return Board;
}());
var urlParams = new URLSearchParams(window.location.search);
var gameMode = urlParams.get("gameMode");
var gameBoard = new Board(DifficultySettings[gameMode]);
gameBoard.startGame();
