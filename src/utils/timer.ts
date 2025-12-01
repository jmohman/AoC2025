let startTime: bigint | null = null;
let logVerbose:boolean = false;

export function startTimer() {
  startTime = process.hrtime.bigint();
  logVerbose = !!process.argv && !!process.argv.length && process.argv[process.argv.length - 1] === "debug";
}

export function printProgress(numDone:number, total:number) {

    if (!logVerbose) {
        return;
    }

    if (!startTime) throw new Error("Timer not started");

    const currentTime = process.hrtime.bigint();
    const timePassed = Number(currentTime - startTime);
    const partDone = numDone / total;


    console.log(`${Math.round(partDone * 100)}%`, 
                "Time passed:", 
                getTimeString(timePassed / 1_000_000), 
                "Estimated finish", 
                getTimeString((timePassed / partDone) / 1_000_000), 
            );
}

export function endTimer() {
  if (!startTime) throw new Error("Timer not started");

  console.log("Total time:", getTimeString(Number(process.hrtime.bigint() - startTime) / 1_000_000))

  startTime = null;
}

export function getTimeString(time:number): string {

    if (time < 1000) return `${time.toFixed(2)} ms`;

    return `${(time / 1000).toFixed(2)} s`;
}