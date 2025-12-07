import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let pos:number[] = [lines[0].indexOf('S'), 0];
  let maxY = lines.length;
  let numExits = 0;

  const splitters = new Map<string, number | null>();

  lines.forEach((line, rowIndex) => {

    line.split("").forEach((cell, colIndex) => {
      if (cell === '^') {
        splitters.set(`${colIndex}_${rowIndex}`, null);
      }
    });
  });



  const moveBeam = (pos:number[]):number => {
    const newPos = [pos[0], pos[1] + 1];

    if (newPos[1] < maxY) {

      let key = `${newPos[0]}_${newPos[1]}`;

      if (splitters.has(key)) {
        let numExitsBelow = splitters.get(key);

        if (numExitsBelow !== null) {
          numExits += numExitsBelow!;
        } else {          
          numExitsBelow = 0;
          numExitsBelow += moveBeam([newPos[0] - 1, newPos[1]]);
          numExitsBelow += moveBeam([newPos[0] + 1, newPos[1]]);
          splitters.set(key, numExitsBelow);
        }

        return numExitsBelow!;
      } else {
        return moveBeam(newPos);
      }
    } else {
      numExits++;
      return 1;
    }
  };

  moveBeam(pos);

  console.log(numExits);

  endTimer();
}

run();