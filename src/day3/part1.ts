import { readLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let sum = 0;

  lines.forEach(bank => {
    const batteries = [...bank].map(Number);

    let first = batteries[0];
    let second = batteries[batteries.length - 1];

    for (let i = 1; i < batteries.length - 1; i++) {
      const val = batteries[i];

      if (val > first) {
        first = val;
        second = batteries[batteries.length - 1]
      } else if (val > second) {
        second = val;

        if (second === 9) {
          sum += 99;
          return;
        }
      }
    }

    sum += first * 10 + second;
  });

  console.log(sum);

  endTimer();
}

run();