import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

type Device = {
    input:string;
    outputs: string[];
    numWaysOut:number|null;
  };

function run() {
  
  const lines = readSplitLines(" ", false);

  startTimer();

  const devices:Map<string, Device> = new Map<string, Device>();

  devices.set("out", {
        input: "out",
        outputs: [],
        numWaysOut: 1
      } as Device);

  lines.forEach(d =>{
    let input = d[0].slice(0, d[0].length - 1);
    let output = d.slice(1);

    if (input !== "out") {
      devices.set(input, {
        input: input,
        outputs: output,
        numWaysOut: null
      } as Device)
    }
  });

  const setOutputs = (device:Device):number => {

    if (device.numWaysOut === null) {
      device.numWaysOut = 0;
      device.outputs.forEach(childDevice => {
        device.numWaysOut! += setOutputs(devices.get(childDevice)!);
      });
    }

    return device.numWaysOut;
  };

  for (const [_, device] of devices) {
    setOutputs(device);
  }

  console.log(devices.get("you")!.numWaysOut);

  endTimer();
}

run();