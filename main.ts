interface BlockAttributes {
  name: string;
  width: number;
  height: number;
  image: string;
}

import { fields } from "./possibleImages.js";

class Block {
  private readonly name: string;
  private readonly width: number;
  private readonly height: number;
  private readonly image: string;
  private imageElement: HTMLImageElement | undefined;
  private divElement: HTMLDivElement | undefined;
  private openFunction!: () => void;

  constructor(
    name: string,
    width: number,
    height: number,
    image: string,
    openFunction: void
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  setOpenFunction(openFunction: () => void) {
    this.openFunction = openFunction;
  }

  getOpenFunction() {
    return this.openFunction;
  }

  getAttributes(): BlockAttributes {
    return {
      name: this.name,
      width: this.width,
      height: this.height,
      image: this.image,
    } as BlockAttributes;
  }

  setElement(element: HTMLElement) {
    switch (element.tagName) {
      case "DIV":
        this.divElement = element as HTMLDivElement;
        break;
      case "IMG":
        this.imageElement = element as HTMLImageElement;
        break;
    }
  }

  getElement(elementName: string) {
    switch (elementName.toUpperCase()) {
      case "DIV":
        return this.divElement;
      case "IMG":
        return this.imageElement;
    }
  }
  deleteElement(element: HTMLElement) {
    switch (element.tagName) {
      case "DIV":
        this.divElement?.remove();
        break;
      case "IMG":
        this.imageElement?.remove();
        break;
      default:
        break;
    }
  }
}

class Board {
  private readonly blocks: Block[][];
  private readonly container;
  private openedBlocks: Block[];

  constructor(size: number) {
    this.container = document.querySelector(".container")!!;
    this.blocks = [];
    const addedFields: { [key: string]: number } = {};
    for (let i = 0; i < size; i++) {
      // row
      this.blocks[i] = [];
      for (let j = 0; j < size; j++) {
        const field = fields[0];
        this.blocks[i][j] = new Block("block", 100, 100, field.concat(".png"));
        if (addedFields[field] == 1) {
          console.log(addedFields[field]);
          addedFields[field] = addedFields[field] + 1;
          fields.shift();
        } else {
          addedFields[field] = 1;
        }
      }
    }
    this.openedBlocks = [];
  }

  draw() {
    for (let i = 0; i < this.blocks.length; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < this.blocks.length; j++) {
        const div = document.createElement("div");
        const block = this.blocks[i][j];
        const attributes = block.getAttributes();
        div.style.width = attributes.width.toString().concat("px");
        div.style.height = attributes.height.toString().concat("px");
        div.classList.add("block");
        div.style.backgroundColor = "black";
        block.setElement(div);
        const openBlockFunction = () => this.open(block);
        div.addEventListener("click", openBlockFunction);
        block.setOpenFunction(openBlockFunction);
        row?.appendChild(div);
      }
      this.container.appendChild(row);
    }
  }

  open(block: Block) {
    if (this.openedBlocks.length === 2) {
      return;
    }
    const img = document.createElement("img");
    const attributes = block.getAttributes();
    img.src = "images/" + attributes.image;
    img.width = attributes.width;
    img.height = attributes.height;
    block.setElement(img);
    const div = block.getElement("DIV")!;

    const animationEndCallback = () => {
      div.appendChild(img);
      div.classList.remove("flip");
      div.removeEventListener("animationend", animationEndCallback);
    };
    div.classList.add("flip");
    div.addEventListener("animationend", animationEndCallback);
    this.openedBlocks.push(block);
    if (this.openedBlocks.length === 2) {
      let match =
        this.openedBlocks[0].getAttributes().image ===
        this.openedBlocks[1].getAttributes().image;
      setTimeout(() => {
        this.handleOpenPair(match);
      }, 2000);
    }
  }

  handleOpenPair(match: boolean) {
    this.openedBlocks.forEach((block) => {
      //console.log(block.getElement("DIV"));
      //console.log(block.getElement("IMG"));
      console.log(block);
      if (match) {
        /* Uncomment these 2 lines to remove the 2 matching divs */
        //block.deleteElement(block.getElement("IMG")!);
        //block.deleteElement(block.getElement("DIV")!);
        block
          .getElement("DIV")
          ?.removeEventListener("click", block.getOpenFunction());
      } else {
        block.deleteElement(block.getElement("IMG")!);
      }
      this.openedBlocks = [];
    });
    console.log("should remove the blocks");
  }
}

const gameBoard = new Board(4);
gameBoard.draw();
