import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

type Tree = {
  rows:number;
  cols:number;
  presents:number[]
};

type Point = {
  row:number;
  col:number;
};

type Present = {
  points:Point[];
};

function run() {
  
  const lines = readLines(false);

  startTimer();

  let lineIndex = 0;
  const trees:Tree[] = [];
  const presents:Present[] = [];

  do {
    if (lines[lineIndex].includes("x")) {
      const items = lines[lineIndex].split(" ");
      const size = items[0].slice(0, items[0].length - 1).split("x");
      const presentCounts = items.slice(1).map(Number);
      
      const tree = {
        cols: Number(size[0]),
        rows: Number(size[1]),
        presents:[]
      } as Tree;

      tree.presents = presentCounts;

      trees.push(tree);
    } else {
      lineIndex++;
      let present = {
        points: []
      } as Present;

      presents.push(present);

      let presentRow = lineIndex;

      while (lines[presentRow].length) {
        lines[presentRow].split("").forEach((element, index) => {
          if (element === "#") {
            present.points.push({
              col: index,
              row: presentRow - lineIndex
            } as Point)
          }
        });

        presentRow++;
      }

      lineIndex = presentRow;
    }

    lineIndex++;
  } while (lineIndex < lines.length)

  let numFits = 0;
  let numUnknown = 0;

  trees.forEach(tree => {
    let size = tree.cols * tree.rows;
    let presentSize = 0;
    let maxPresentSize = 0;

    for (let index = 0; index < tree.presents.length; index++) {
      presentSize += tree.presents[index] * presents[index].points.length;
      maxPresentSize += tree.presents[index] * 9;
    }

    if (presentSize > size) {
      return;
    }

    let squareSize = (tree.cols - (tree.cols % 3)) * (tree.rows - (tree.rows % 3));

    if (presentSize <= squareSize) {
      numFits++;
    } else {
      numUnknown++;
    }
  });

  console.log(numFits, numUnknown);

  endTimer();
}

run();