import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

type JunctionBox = {
    x: number;
    y: number;
    z: number;
};

type Circuit = {
    id:number;
    boxIds: number[];
};

function run() {
  
  const lines = readSplitLines(",", false);
  const numConnectionsToMake = 1000;

  startTimer();

  let boxes:JunctionBox[] = [];

  lines.forEach(line => {
    let points = line.map(Number);
    boxes.push({
      x: points[0],
      y: points[1],
      z: points[2]
    } as JunctionBox);
  })

  const getDistance = (box1:JunctionBox, box2:JunctionBox) => {
    return Math.sqrt(Math.pow(box1.x - box2.x, 2) + Math.pow(box1.y - box2.y, 2) + Math.pow(box1.z - box2.z, 2));
  };

  let distances:[[number, number], number][] = [];

  boxes.forEach((c1, i1) => {
    boxes.forEach((c2, i2) => {
      if (i1 < i2) {
        distances.push([[i1, i2], getDistance(c1, c2)]);
      }
    });
  });

  distances.sort((a, b) => a[1] - b[1]);

  let circuits:Circuit[] = Array.from({ length: boxes.length }, (_, i) => { return { 
      id: i,
      boxIds: [i] 
    } as Circuit; });

  let connectionsMade = 0;

  for (let i = 0; i < distances.length; i++) {
    let dist:[[number, number], number] = distances[i];

    let circuit1 = circuits.filter(c => c.boxIds.includes(dist[0][0]))[0];
    let circuit2 = circuits.filter(c => c.boxIds.includes(dist[0][1]))[0];

    if (circuit1.id != circuit2.id) {
      circuit1.boxIds.push(...circuit2.boxIds);
      circuits.splice(circuits.findIndex(c => c.id === circuit2.id), 1);
    }

    if (++connectionsMade === numConnectionsToMake) {
      break;
    }
  }

  circuits.sort((a, b) => b.boxIds.length - a.boxIds.length);

  //console.log(circuits);

  console.log(circuits[0].boxIds.length * circuits[1].boxIds.length * circuits[2].boxIds.length);

  endTimer();
}

run();