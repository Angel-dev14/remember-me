import { fields } from "./possibleImages.js";
class AbstractAnimation {
    constructor(headingElementRef) {
        this.headingElementRef = headingElementRef;
    }
}
class ConfettiAnimation extends AbstractAnimation {
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
            this.headingElementRef.textContent = "You Won";
        }
    }
    stop() {
        this.headingElementRef.textContent = "";
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
    static createElement(elementType) {
        return document.createElement(elementType);
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
        // here we bind this inside the click function to be the block object instead of the function
        this.clickHandler = this.click.bind(this);
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
    // Here we pass this to the onClick function, this will refer to the block element as it was bound in the constructor
    // The onClick function is passed when the object is created inside Board in createBlocksArray
    click() {
        this.onClick && this.onClick(this);
    }
    open() {
        const animationEndCallback = () => {
            this.div.appendChild(this.figure.getImgElementRef());
            this.div.classList.remove("flip");
            this.div.removeEventListener("animationend", animationEndCallback);
        };
        this.div.classList.add("flip");
        this.div.addEventListener("animationend", animationEndCallback);
    }
    reset(match) {
        if (match) {
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
    constructor(size) {
        this.matchedPairs = 0;
        this.size = size;
        this.boardSize = size * size;
        this.container = document.querySelector(".container");
        this.limit = 2;
        this.openedBlocks = [];
        this.blocks = [];
        const blocksArray = this.createBlockArray();
        for (let i = 0; i < size; i++) {
            this.blocks[i] = [];
            for (let j = 0; j < size; j++) {
                this.blocks[i][j] = blocksArray[i * size + j];
            }
        }
    }
    // TODO This is where the logic for detecting matches, triggering resets and using timeouts is
    openBlock(block) {
        if (!this.openedBlocks.includes(block) &&
            !(this.openedBlocks.length === this.limit)) {
            block.open();
            this.openedBlocks.push(block);
        }
        if (this.openedBlocks.length === this.limit) {
            this.pairOpen();
        }
    }
    pairOpen() {
        const firstBlock = this.openedBlocks[0];
        const secondBlock = this.openedBlocks[1];
        const blocksMatch = firstBlock.getFigureRef().src === secondBlock.getFigureRef().src;
        setTimeout(() => {
            this.resetPair(blocksMatch);
        }, 2000);
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
        setTimeout(() => confettiAnimation.stop(), 5000);
    }
    // the block creating logic was moved into a separate method instead of being in the constructor
    // It is still called the same way as before inside of the constructor
    createBlockArray() {
        let blocksArray = [];
        const addedFields = {};
        for (let i = 0; i < this.boardSize; i++) {
            const field = fields[0];
            const link = `images/${field}.png`;
            const figure = new Figure(link);
            // Here we bind inside of the openBlock function to refer to the Board instead of the function
            // This means that a method from Board will be called inside of a Block object, and the Block will
            // Have access to the Board object
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
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < this.blocks.length; j++) {
                const block = this.blocks[i][j].getDivElementRef();
                row === null || row === void 0 ? void 0 : row.appendChild(block);
            }
            this.container.appendChild(row);
        }
    }
}
const gameBoard = new Board(4);
gameBoard.draw();
//# sourceMappingURL=main.js.map