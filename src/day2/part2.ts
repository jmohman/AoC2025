import { readSplitLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const ranges = readSplitLines(",")[0];

  startTimer();

  const isSillySequence = (num:string, seqLen:number):boolean => {
    const strLen = num.length;

    for (let i = 0; i < strLen; i++)
    {
      if (num[i] !== num[i % seqLen])
      {
        return false;
      }
    }

    return true;
  }

  const isSilly = (num:string):boolean => {

    for (let seqLen = 1; seqLen <= num.length / 2; seqLen++)
    {
      if(!(num.length % seqLen) && isSillySequence(num, seqLen))
      {
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