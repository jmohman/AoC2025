import { readLines, readSplitLines } from "../utils/files";
import { startTimer, endTimer, printProgress } from "../utils/timer";

type Point = {
    x: number;
    y: number;
};

type Line = {
    from: Point;
    to: Point;
};

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function pointToString(point: Point): string {
  return `${point.x}_${point.y}`;
}

function run() {
  
  const lines = readSplitLines(",", false);

  startTimer();

  const redTiles:Point[] = lines.map(line => line.map(Number)).map(nums => { return { x: nums[0], y: nums[1] }});

  const frame:Map<string, boolean> = new Map<string, boolean>();
  const forbiddenFrame:Map<string, boolean> = new Map<string, boolean>();

  let tileIndex = 0;

  const addToFrame = (from:Point, to:Point) => {

    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;
    let stepX = deltaX === 0 ? 0 : (deltaX > 0 ? 1 : -1);
    let stepY = deltaY === 0 ? 0 : (deltaY > 0 ? 1 : -1);

    frame.set(pointToString(from), true);
    let point = { x: from.x, y: from.y }

    do {
      point.x += stepX;
      point.y += stepY;

      if (!pointsEqual(point, to)) {
        frame.set(pointToString(point), true);
      } else {
        break;
      }

    } while(true);
  };

  while (tileIndex < redTiles.length)
  {
    addToFrame(redTiles[tileIndex], redTiles[(tileIndex + 1) % redTiles.length]);
    tileIndex++;
  }

  console.log("frame length", frame.size);

  // frame.forEach(point => {
  //   console.log(point);
  // });

  const addForbiddenFrame = (point:Point) => { 
    if (!frame.has(pointToString(point)) && !forbiddenFrame.has(pointToString(point))) {
      forbiddenFrame.set(pointToString(point), true);

      let up = { x: point.x, y: point.y - 1 };
      let down = { x: point.x, y: point.y + 1 };
      let left = { x: point.x - 1, y: point.y };
      let right = { x: point.x + 1, y: point.y };
      let downRight = { x: point.x + 1, y: point.y + 1 };
      let downLeft = { x: point.x - 1, y: point.y + 1 };
      let upRight = { x: point.x + 1, y: point.y - 1 };
      let upLeft = { x: point.x - 1, y: point.y - 1 };

      if (frame.has(pointToString(up)) || frame.has(pointToString(down))) {
        addForbiddenFrame(left);
        addForbiddenFrame(right);
      }

      if (frame.has(pointToString(left)) || frame.has(pointToString(right))) {
        addForbiddenFrame(up);
        addForbiddenFrame(down);
      }

      if (frame.has(pointToString(downRight))) {
        addForbiddenFrame(down);
        addForbiddenFrame(right);
      }

      if (frame.has(pointToString(upRight))) {
        addForbiddenFrame(up);
        addForbiddenFrame(right);
      }

      if (frame.has(pointToString(upLeft))) {
        addForbiddenFrame(up);
        addForbiddenFrame(left);
      }

      if (frame.has(pointToString(downLeft))) {
        addForbiddenFrame(down);
        addForbiddenFrame(left);
      }
    }
  };

  const findForbiddenFrame = () => { 
    let x:number = -1;
    let y:number = -1;

    while (!frame.has(pointToString({ x, y }))) {
      x++;
      y++;
    }

    let point = { x: x - 1, y: y - 1 };

    forbiddenFrame.set(pointToString(point), true);

    while (true) {

      let up = { x: point.x, y: point.y - 1 };
      let down = { x: point.x, y: point.y + 1 };
      let left = { x: point.x - 1, y: point.y };
      let right = { x: point.x + 1, y: point.y };
      let downRight = { x: point.x + 1, y: point.y + 1 };
      let downLeft = { x: point.x - 1, y: point.y + 1 };
      let upRight = { x: point.x + 1, y: point.y - 1 };
      let upLeft = { x: point.x - 1, y: point.y - 1 };

      if (frame.has(pointToString(up)) && !frame.has(pointToString(left))) {
        point.x--; //left
      }
      else if (frame.has(pointToString(left)) && !frame.has(pointToString(down))) {
        point.y++; // down
      }
      else if (frame.has(pointToString(down)) && !frame.has(pointToString(right))) {
        point.x++; // right
      }
      else if (frame.has(pointToString(right)) && !frame.has(pointToString(up))) {
        point.y--; // up
      }
      else if (frame.has(pointToString(upRight)) && !frame.has(pointToString(up))) {
        point.y--; // up
      }
      else if (frame.has(pointToString(downLeft)) && !frame.has(pointToString(down))) {
        point.y++; // down
      }
      else if (frame.has(pointToString(upLeft)) && !frame.has(pointToString(left))) {
        point.x--; // left
      }
      else if (frame.has(pointToString(downRight)) && !frame.has(pointToString(right))) {
        point.x++; // right
      }

      if (forbiddenFrame.has(pointToString(point))) {
        break;
      }

      forbiddenFrame.set(pointToString(point), true);
    }
  };

  findForbiddenFrame();

  console.log("forbidden frame length", forbiddenFrame.size);
  
  const lineHitsForbiddenFrame = (from:Point, to:Point):boolean => {

    let deltaX = to.x - from.x;
    let deltaY = to.y - from.y;
    let stepX = deltaX === 0 ? 0 : (deltaX > 0 ? 1 : -1);
    let stepY = deltaY === 0 ? 0 : (deltaY > 0 ? 1 : -1);

    let point = { x: from.x, y: from.y }

    do {
      point.x += stepX;
      point.y += stepY;

      if (forbiddenFrame.has(pointToString(point))) {
        return true;
      }

    } while(!pointsEqual(point, to));

    return false;
  };

  let maxArea = 0;
  let max = redTiles.length * redTiles.length / 2;
  let numDone = 0;


  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {

      numDone++;

      if (numDone % 100 === 0) {
        printProgress(numDone, max);
      }

      const corners = [
        { x: Math.min(redTiles[i].x, redTiles[j].x), y: Math.min(redTiles[i].y, redTiles[j].y) },
        { x: Math.min(redTiles[i].x, redTiles[j].x), y: Math.max(redTiles[i].y, redTiles[j].y) },
        { x: Math.max(redTiles[i].x, redTiles[j].x), y: Math.max(redTiles[i].y, redTiles[j].y) },
        { x: Math.max(redTiles[i].x, redTiles[j].x), y: Math.min(redTiles[i].y, redTiles[j].y) },
      ];

      if (  lineHitsForbiddenFrame(corners[0], corners[1])
          || lineHitsForbiddenFrame(corners[1], corners[2])
          || lineHitsForbiddenFrame(corners[2], corners[3])
          || lineHitsForbiddenFrame(corners[3], corners[0])
        )
      {
        //console.log("hits frame");
        continue;
      }

      //console.log("does NOT hit frame");

      let area = (1 + Math.abs(redTiles[i].x - redTiles[j].x)) * (1 + Math.abs(redTiles[i].y - redTiles[j].y));
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  console.log(maxArea);

  endTimer();
}

run();