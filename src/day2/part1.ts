import { readSplitLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const ranges = readSplitLines(",")[0];

  //console.log(ranges);

  startTimer();

  const isSilly = (num:string):boolean => {

    if (num.length % 2 > 0) {
      return false;
    }

    if (num.substring(num.length / 2) === num.substring(0, num.length / 2)) {
      //console.log(num);
      return true;
    }

    return false;
  };

  let total = 0;

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i].split("-");
    const min = parseInt(range[0]);
    const max = parseInt(range[1]);

    for (let j = min; j <= max; j++) {
      if (isSilly(String(j))) {
        total += j;
      }
    }
  }

  console.log("total", total);

  endTimer();
}

run();