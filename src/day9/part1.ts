import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readSplitLines(",", false);

  startTimer();

  const tiles:number[][] = lines.map(line => line.map(Number));

  let maxArea = 0;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      let area = (1 + Math.abs(tiles[i][0] - tiles[j][0])) * (1 + Math.abs(tiles[i][1] - tiles[j][1]));

      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  console.log(maxArea);

  endTimer();
}

run();