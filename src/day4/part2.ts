import { readLines } from "../utils/files";
import { printMap } from "../utils/output";
import { printProgress, startTimer, endTimer } from "../utils/timer";

type Coordinates = [number, number];

function run() {
  
  const lines = readLines(false);

  startTimer();

  let map:boolean[][] = [];

  for (let row = 0; row < lines.length; row++) {

    map.push([]);

    const line = lines[row];

    for (let col = 0; col < line.length; col++) {
      map[row].push(line[col] === "@");
    }
  }

  const removePaper = ():number => {
    let removable:Coordinates[] = [];


    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
          let numClose = 0;

          if (!map[row][col]) {
            continue;
          }

          for (let r = Math.max(0, row - 1); r < Math.min(map.length, row + 2); r++)
          {
            for (let c = Math.max(0, col - 1); c < Math.min(map[row].length, col + 2); c++)
            {
              //console.log(row, col, r, c);

              if (map[r][c] && (r != row || c != col)) {
                numClose++;
              }
            }
          }

          if (numClose < 4) {
            removable.push([row, col]);
          }
      }
    }

    removable.forEach(coordinates => {
      map[coordinates[0]][coordinates[1]] = false;
    });

    return removable.length;
  }

  let removed = 0;
  let totalRemoved = 0;

  do {
    removed = removePaper();
    totalRemoved += removed;
  } while (removed);

  console.log(totalRemoved);

  endTimer();
}

run();