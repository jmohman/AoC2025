import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  const factorSets:number[][] = [];
  let operators:string[] = [];
  const chars:string[][] = [];

  lines.forEach(line => {
    if (line[0] === '+' || line[0] === '*') {

      operators = line.trim().split(/\s+/);
      operators.reverse();
    } else {
      chars.push(line.split(""));
    }
  });

  let startIndex = Math.max(...chars.map(line => line.length)) - 1;

  // console.log(chars);
  // console.log(startIndex);

  while (startIndex >= 0) {
  
    let index = startIndex;
    let factorSet:number[] = [];
    factorSets.push(factorSet);

    while (index >= 0) {
      let val = 0;

      let numDigits = 0;
      let digitIndex = 0;
      for (let i = 0; i < chars.length; i++) {
        if (chars[i][index] != ' ') {
          numDigits++;
        }
      }

      for (let i = 0; i < chars.length; i++) {
        if (chars[i][index] != ' ') {
          val += Number(chars[i][index]) * Math.pow(10, numDigits - 1 - digitIndex);
          digitIndex++;
        }
      }

      if (val > 0) {
        factorSet.push(val); 
        index--;

        if (index < 0) {
          startIndex = index;
        }
      } else {
        startIndex = index - 1;
        break;
      }
    }
  }

  // console.log(factorSets);
  // console.log(operators);

  let total = 0;

  factorSets.forEach((factors, index) => {

    if (operators[index] === '*') {
      total += factors.reduce((a, b) => a * b, 1);
    } else {
      total += factors.reduce((a, b) => a + b, 0);
    }
  });

  console.log(total);

  endTimer();
}

run();