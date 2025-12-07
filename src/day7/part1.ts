import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let pos:number[] = [lines[0].indexOf('S'), 0];
  let maxY = lines.length;

  const splitters = new Map<string, boolean>(); //bool for used/not used

  lines.forEach((line, rowIndex) => {

    line.split("").forEach((cell, colIndex) => {
      if (cell === '^') {
        splitters.set(`${colIndex}_${rowIndex}`, false);
      }
    });
  });

  const moveBeam = (pos:number[]) => {
    const newPos = [pos[0], pos[1] + 1];

    if (newPos[1] < maxY) {

      let key = `${newPos[0]}_${newPos[1]}`;

      if (splitters.has(key)) {
        const used = splitters.get(key);

        if (!used) {
          moveBeam([newPos[0] - 1, newPos[1]]);
          moveBeam([newPos[0] + 1, newPos[1]]);
          splitters.set(key, true);
        }
      } else {
        moveBeam(newPos);
      }
    }
  };

  moveBeam(pos);

  let count = 0;

  splitters.forEach((value) => {
    if (value) count++;
  });
  
  console.log(count);

  endTimer();
}

run();