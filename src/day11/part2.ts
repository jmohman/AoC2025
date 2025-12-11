import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

type Device = {
    input:string;
    outputs: string[];
    waysOut:WayOuts|null;
};

type WayOut = {
    viaDac:boolean;
    viaFft: boolean;
};

type WayOuts = {
  numClean:number;
  numViaDac:number;
  numViaFft:number;
  numComplete:number;
};


function run() {
  
  const lines = readSplitLines(" ", false);

  startTimer();

  const devices:Map<string, Device> = new Map<string, Device>();

  devices.set("out", {
        input: "out",
        outputs: [],
        waysOut: { numClean: 1, numComplete: 0, numViaDac: 0, numViaFft: 0 } as WayOuts
      } as Device);

  lines.forEach(d =>{
    let input = d[0].slice(0, d[0].length - 1);
    let output = d.slice(1);

    if (input !== "out") {
      devices.set(input, {
        input: input,
        outputs: output,
        waysOut:null
      } as Device)
    }
  });

  const setOutputs = (device:Device):WayOuts => {

    if (device.waysOut === null) {
      device.waysOut = { numClean: 0, numComplete: 0, numViaDac: 0, numViaFft: 0 } as WayOuts;
      device.outputs.forEach(childDevice => {
        let childOutputs = setOutputs(devices.get(childDevice)!);

        if (device.input === "dac") {
          device.waysOut!.numClean = 0;
          device.waysOut!.numComplete += childOutputs.numViaFft + childOutputs.numComplete;
          device.waysOut!.numViaDac += childOutputs.numClean;
          device.waysOut!.numViaFft = 0;
        } else if (device.input === "fft") {
          device.waysOut!.numClean = 0;
          device.waysOut!.numComplete += childOutputs.numViaDac + childOutputs.numComplete;
          device.waysOut!.numViaDac = 0;
          device.waysOut!.numViaFft += childOutputs.numClean;
        } else {
          device.waysOut!.numClean += childOutputs.numClean;
          device.waysOut!.numComplete += childOutputs.numComplete;
          device.waysOut!.numViaDac += childOutputs.numViaDac;
          device.waysOut!.numViaFft += childOutputs.numViaFft;
        }
      });
    }

    return device.waysOut;
  };

  for (const [_, device] of devices) {
    setOutputs(device);
  }

  console.log(devices.get("svr")!.waysOut?.numComplete);

  endTimer();
}

run();