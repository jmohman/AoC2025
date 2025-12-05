import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let breakFound = false;

  let spans:number[][] = [];
  let ids:number[] = [];

  lines.forEach(line => {
    if (breakFound) {
      ids.push(Number(line));
    } else if (line === "") {
      breakFound = true;
    } else {
      spans.push(line.split("-").map(Number));
    }
  });

  let numValid = ids.filter(id => spans.some(s => s[0] <= id && s[1] >= id)).length;

  console.log(numValid);

  endTimer();
}

run();