import { readSplitLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const ranges = readSplitLines(",")[0];

  startTimer();

  const isSilly = (num:string):boolean => {

    for (let seqLen = 1; seqLen <= num.length / 2; seqLen++)
    {
      if (num.length / seqLen != Math.floor(num.length / seqLen)) {
        continue;
      }

      let seq = num.substring(0, seqLen);
      let offset = seqLen;
      let allOk = true;

      while (offset < num.length) {

        if (num.substring(offset, offset + seqLen) != seq) {
          allOk = false;
          break;
        }

        offset += seqLen;
      }

      if (allOk) {
        return true;
      }
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