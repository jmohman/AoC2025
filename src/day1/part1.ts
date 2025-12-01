import { readLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines();

  startTimer();
  let pos:number = 50;
  let numZero:number = 0;

  for (let i = 0; i < lines.length; i++) {

    const line:string = lines[i];

    if (line[0] === 'L') {
      pos -= parseInt(line.substring(1));
    } else {
      pos += parseInt(line.substring(1));
    }

    if (!(pos % 100)) {
      numZero++;
    }
  }

  console.log(numZero);

  endTimer();
}

run();