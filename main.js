"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var possibleImages_js_1 = require("./possibleImages.js");
var Animation = /** @class */ (function () {
    function Animation(h2Element) {
        this.gameoverMessage = h2Element;
    }
    Animation.prototype.showConfetti = function () {
        var _this = this;
        // Number of pieces of confetti to throw
        var confettiCount = 200;
        // Array to store the confetti
        var confettiArray = [];
        // Create the confetti pieces and add them to the array
        for (var i = 0; i < confettiCount; i++) {
            var confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.textContent = "🎉";
            confetti.style.left = "".concat(Math.random() * 100, "vw");
            confetti.style.animationDuration = "".concat(Math.random() * 2 + 3, "s");
            confettiArray.push(confetti);
        }
        // Function to start the confetti animation
        var startConfetti = function () {
            if (_this.gameoverMessage) {
                _this.gameoverMessage.textContent = "You Won!";
            }
            confettiArray.forEach(function (confetti) {
                document.body.appendChild(confetti);
            });
        };
        // Function to stop the confetti animation
        var stopConfetti = function () {
            confettiArray.forEach(function (confetti) {
                confetti.remove();
            });
        };
        // Start the confetti animation
        startConfetti();
        // Stop the confetti animation after 5 seconds
        setTimeout(stopConfetti, 5000);
    };
    return Animation;
}());
var ElementType;
(function (ElementType) {
    ElementType["DIV"] = "div";
    ElementType["IMG"] = "img";
})(ElementType || (ElementType = {}));
var ImprovedElementCreator = /** @class */ (function () {
    function ImprovedElementCreator() {
    }
    ImprovedElementCreator.createElement = function (elementType) {
        return document.createElement(elementType);
    };
    return ImprovedElementCreator;
}());
var ElementCreator = /** @class */ (function () {
    function ElementCreator(name, width, height, image, style, className) {
        this.name = name;
        this.width = width;
        this.height = height;
        if (image) {
            this.image = image;
        }
        if (style) {
            this.style = style;
        }
        if (className) {
            this.className = className;
        }
    }
    ElementCreator.prototype.createDiv = function () {
        var div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        if (this.className) {
            div.classList.add(this.className ? this.className : "");
        }
        if (this.style) {
            Object.assign(div.style, this.style);
        }
        return div;
    };
    ElementCreator.prototype.createImg = function () {
        var img = document.createElement("img");
        img.src = this.image ? this.image : "";
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        if (this.className) {
            img.classList.add(this.className ? this.className : "");
        }
        if (this.style) {
            Object.assign(img.style, this.style);
        }
        return img;
    };
    ElementCreator.prototype.createElement = function () {
        switch (this.name.toUpperCase()) {
            case "DIV":
                return this.createDiv();
            case "IMG":
                return this.createImg();
        }
    };
    return ElementCreator;
}());
var BlockElement = /** @class */ (function () {
    function BlockElement(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
    BlockElement.prototype.createBlock = function () {
        var divElement = ImprovedElementCreator.createElement(ElementType.DIV);
        divElement.style.width = "".concat(this.width, "px");
        divElement.style.height = "".concat(this.width, "px");
        divElement.classList.add("block");
        return divElement;
    };
    return BlockElement;
}());
var Figure = /** @class */ (function () {
    function Figure() {
    }
    return Figure;
}());
var Block = /** @class */ (function () {
    function Block(name, width, height, image, openFunction) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    Block.prototype.setOpenFunction = function (openFunction) {
        this.openFunction = openFunction;
    };
    // Created a single function for opening so that we can later disable the event listener
    // When disabling an event listener we need to pass the same exact function that was initially passed
    // Anonymous functions cannot be later disabled
    Block.prototype.getOpenFunction = function () {
        return this.openFunction;
    };
    Block.prototype.getAttributes = function () {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            image: this.image,
        };
    };
    Block.prototype.setElement = function (element) {
        switch (element.tagName) {
            case "DIV":
                this.divElement = element;
                break;
            case "IMG":
                this.imageElement = element;
                break;
        }
    };
    Block.prototype.getElement = function (elementName) {
        switch (elementName.toUpperCase()) {
            case "DIV":
                return this.divElement;
            case "IMG":
                return this.imageElement;
        }
    };
    Block.prototype.deleteElement = function (element) {
        var _a, _b;
        switch (element.tagName) {
            case "DIV":
                (_a = this.divElement) === null || _a === void 0 ? void 0 : _a.remove();
                break;
            case "IMG":
                (_b = this.imageElement) === null || _b === void 0 ? void 0 : _b.remove();
                break;
            default:
                break;
        }
    };
    return Block;
}());
var Board = /** @class */ (function () {
    function Board(size) {
        this.remainingBlocks = size * size;
        this.container = document.querySelector(".container");
        var addedFields = {};
        // Creating a 1d array in order to be shuffled later
        var flatBlocks = [];
        for (var i = 0; i < size * size; i++) {
            var field = possibleImages_js_1.fields[0];
            var block = new BlockElement("block", 100, 100);
            // flatBlocks.push(new Block("block", 100, 100, field.concat(".png")));
            flatBlocks.push(block);
            if (addedFields[field] == 1) {
                addedFields[field] = addedFields[field] + 1;
                possibleImages_js_1.fields.shift();
            }
            else {
                addedFields[field] = 1;
            }
        }
        // flatBlocks = this.shuffleBlocks(flatBlocks);
        //
        // this.blocks = [];
        // for (let i = 0; i < size; i++) {
        //   this.blocks[i] = [];
        //   for (let j = 0; j < size; j++) {
        //     // Multiplying i with size to get the current row as we are working with a 1d array
        //     this.blocks[i][j] = flatBlocks[i * size + j];
        //   }
        // }
        this.openedBlocks = [];
    }
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
        var _this = this;
        for (var i = 0; i < this.blocks.length; i++) {
            var row = document.createElement("div");
            row.classList.add("row");
            var _loop_1 = function (j) {
                // TODO here we need to create a element creator class
                // to create the will be appended and set in the block
                //const div = document.createElement("div");
                var block = this_1.blocks[i][j];
                var attributes = block.getAttributes();
                var div = new ElementCreator("div", attributes.width.toString(), attributes.height.toString(), undefined, { backgroundColor: "black" }, // Style property
                "block").createElement();
                //div.style.width = attributes.width.toString().concat("px");
                //div.style.height = attributes.height.toString().concat("px");
                //div.classList.add("block");
                //div.style.backgroundColor = "black";
                block.setElement(div);
                var openBlockFunction = function () { return _this.open(block); };
                div.addEventListener("click", openBlockFunction);
                block.setOpenFunction(openBlockFunction);
                row === null || row === void 0 ? void 0 : row.appendChild(div);
            };
            var this_1 = this;
            for (var j = 0; j < this.blocks.length; j++) {
                _loop_1(j);
            }
            this.container.appendChild(row);
        }
    };
    Board.prototype.open = function (block) {
        var _this = this;
        if (this.openedBlocks.length === 2) {
            return;
        }
        // TODO Here we can create the image using the elementCreator again
        var attributes = block.getAttributes();
        var img = new ElementCreator("img", attributes.width.toString(), attributes.height.toString(), "images/".concat(attributes.image)).createElement();
        block.setElement(img);
        var div = block.getElement("DIV");
        var animationEndCallback = function () {
            div.appendChild(img);
            div.classList.remove("flip");
            div.removeEventListener("animationend", animationEndCallback);
        };
        div.classList.add("flip");
        div.addEventListener("animationend", animationEndCallback);
        this.openedBlocks.push(block);
        if (this.openedBlocks.length === 2) {
            var match_1 = this.openedBlocks[0].getAttributes().image ===
                this.openedBlocks[1].getAttributes().image;
            setTimeout(function () {
                _this.handleOpenPair(match_1);
            }, 2000);
        }
    };
    Board.prototype.handleOpenPair = function (match) {
        var _this = this;
        this.openedBlocks.forEach(function (block) {
            var _a;
            if (match) {
                /* Uncomment these lines to remove the 2 matching divs */
                /* let element = block.getElement("DIV");
                block.deleteElement(block.getElement("IMG")!);
                if (element) {
                  element.style.backgroundColor = "white";
                } */
                _this.remainingBlocks--;
                (_a = block
                    .getElement("DIV")) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", block.getOpenFunction());
            }
            else {
                block.deleteElement(block.getElement("IMG"));
            }
            _this.openedBlocks = [];
        });
        console.log(this.remainingBlocks);
        if (this.remainingBlocks == 0) {
            this.gameOver(true);
        }
    };
    Board.prototype.gameOver = function (victory) {
        var gameoverMessage = document.getElementById("gameoverMessage");
        var animation = new Animation(gameoverMessage);
        if (victory) {
            animation.showConfetti();
        }
        else {
            console.log("You Lost");
        }
    };
    return Board;
}());
var gameBoard = new Board(4);
gameBoard.draw();
