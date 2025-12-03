import { readLines } from "../utils/files";
import { printProgress, startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let sum = 0;

  lines.forEach(bank => {

    const batteries = [...bank].map(Number);
    let activeBatteries:number[] = [ batteries[0] ];

    for (let comparisonId = 1; comparisonId < batteries.length; comparisonId++) {

      let anyAdded = false;
      let batteriesLeft = batteries.length - comparisonId;
      let startingPoint = Math.max(0, 12 - batteriesLeft);

      for (let activeId = startingPoint; activeId < activeBatteries.length; activeId++) {
        if (batteries[comparisonId] > activeBatteries[activeId]) {
          activeBatteries = [ ...activeBatteries.slice(0, activeId), batteries[comparisonId] ];
          anyAdded = true;
          break;
        }
      }

      if (!anyAdded && activeBatteries.length < 12) {
        activeBatteries.push(batteries[comparisonId]);
      }

    }

    sum += parseInt(activeBatteries.join(''))
  });

  console.log(sum);

  endTimer();
}

run();