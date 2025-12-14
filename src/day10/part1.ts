import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readSplitLines(" ", false);

  startTimer();

  let numClicks = 0;

  const lightsSet = (indicatorLights:boolean[], currentLights:boolean[]) => {
  
  for (let i = 0; i < indicatorLights.length; i++) {
    if (indicatorLights[i] !== currentLights[i]) {
      return false;
    }
  }

  return true;
};

  const tryClicks = (highestButtonIndexClicked:number, indicatorLights:boolean[], currentLights:boolean[], buttons:number[][], clicksLeft:number):boolean => {

    if (!clicksLeft) {
      return lightsSet(indicatorLights, currentLights);
    }

    for (let i = highestButtonIndexClicked; i < buttons.length; i++) {
      let newCurrentLights = currentLights.map(l => l);
      buttons[i].forEach(val => {
        newCurrentLights[val] = !newCurrentLights[val];
      })

      let solutionFound = tryClicks(Math.max(highestButtonIndexClicked, i), indicatorLights, newCurrentLights, buttons, clicksLeft - 1);

      if (solutionFound) {
        return true;
      }
    }

    return false;
  };

  const getClicks = (indicatorLights:boolean[], buttons:number[][]):number => {

    let numClicks = 1;

    do
    {
      if (tryClicks(0, indicatorLights, indicatorLights.map(l => false), buttons, numClicks))
      {
        break;
      }


      numClicks++;
    } while (true);

    return numClicks;
  };

  lines.forEach(line => {

    let indicatorLights:boolean[] = [];
    let buttons:number[][] = [];

    line[0].slice(1, -1).split("").forEach((val, index) => {
      indicatorLights.push(val === "#");
    });

    line.slice(1, line.length - 1).forEach(button => {
      let indicators = button.substring(1, button.length - 1).split(",").map(Number);
      buttons.push(indicators);
    });

    //console.log(indicatorLights, buttons);
    numClicks += getClicks(indicatorLights, buttons);
  });

  console.log(numClicks);

  endTimer();
}

run();