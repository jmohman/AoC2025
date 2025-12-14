import path, { posix } from "path";
import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer, printProgress, getTimeString } from "../utils/timer";
import { fork } from "child_process";

function run() {
  
  const lines = readSplitLines(" ", false);

  startTimer();

  let numClicks:number = 0;
  let reported:number[] = [];
  
  for (let i = 0; i < lines.length; i++) {

    let line = lines[i];

    {
      const worker = fork("./worker.ts", [], {
        execArgv: ["-r", "ts-node/register"]
      });

      worker.send({ line, index: i });
      worker.on("message", (msg: { clicks: number; index: number }) => {
        const { clicks, index } = msg;

        reported.push(index);
        numClicks += clicks;

        console.log(`${index} reported: ${clicks}`);

        if (reported.length === lines.length) {
          console.log(`TOTAL: ${numClicks}`);
          endTimer();
        } else {
          console.log(`${reported.length} of ${lines.length} done`);
          console.log(`Remaining: ${Array.from({ length: lines.length }, (_, i) => { return i}).filter(i => !reported.includes(i) ).join(',')}`);
        }

        worker.kill("SIGTERM");
      });
    }
  }
}

run();