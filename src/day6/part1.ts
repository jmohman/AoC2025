import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  const factorSets:number[][] = [];
  const operators:string[] = [];

  lines.forEach(line => {
    const columns = line.trim().split(/\s+/);

    columns.forEach((cell, index) => {
      if (cell === "+" || cell === "*") {
        operators.push(cell);
      } else {

        if (index >= factorSets.length)
        {
          factorSets.push([]);
        }

        factorSets[index].push(Number(cell));
      }
    });
  });

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