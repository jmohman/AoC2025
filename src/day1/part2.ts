import { readLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();
  let pos:number = 50;
  let lastPos:number = 50;
  let numZero:number = 0;
  let lastFullLaps:number = 0;

  for (let i:number = 0; i < lines.length; i++) {

    const line:string = lines[i];
    lastPos = pos;
    let dirDown = false;

    if (line[0] === 'L') {
      pos -= parseInt(line.substring(1));
      dirDown = true;
    } else {
      pos += parseInt(line.substring(1));
    }

    let fullLaps:number = Math.floor(pos / 100);

    let lastZero:boolean = !(lastPos % 100);
    let currentZero:boolean = !(pos % 100);


    // numZero += Math.abs(fullLaps - lastFullLaps);

    // if (currentZero && !lastZero && dirDown) {
    //   numZero++;
    // }
    // else if (!currentZero && lastZero && dirDown) {
    //   numZero--;
    // }

    if ((lastZero && currentZero) || (!lastZero && !currentZero)) {
      numZero += Math.abs(fullLaps - lastFullLaps);
    } else if (currentZero) {
      numZero += Math.abs(fullLaps - lastFullLaps);

      if (dirDown) {
        numZero++;
      }
    } else if (lastZero) {
      numZero += Math.abs(fullLaps - lastFullLaps);

      if (dirDown) {
        numZero--;
      }
    }

    lastFullLaps = fullLaps;
  }

  console.log(numZero);

  endTimer();
}

run();