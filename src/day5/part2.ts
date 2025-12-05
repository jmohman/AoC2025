import { readLines } from "../utils/files";
import { startTimer, endTimer } from "../utils/timer";

function run() {
  
  const lines = readLines(false);

  startTimer();

  let breakFound = false;

  let spans:number[][] = [];
  let ids:number[] = [];

  lines.forEach(line => {
    if (breakFound) {
      ids.push(Number(line));
    } else if (line === "") {
      breakFound = true;
    } else {
      spans.push(line.split("-").map(Number));
    }
  });

  const mergeSpans = ():boolean => {

    let anyMerge = false;

    for (let i = 0; i < spans.length; i++) {
      for (let j = i + 1; j < spans.length; j++) {

        const span1 = spans[i];
        const span2 = spans[j];

        if ((span1[0] >= span2[0] && span1[0] <= span2[1]) // span 1 starts within span 2
           || (span1[1] >= span2[0] && span1[1] <= span2[1]) // span 1 ends within span 2
           || (span1[0] <= span2[0] && span1[1] >= span2[1]) // span 1 spans span 2
        ) {
          //mergable
          spans[i] = [Math.min(span1[0], span2[0]), Math.max(span1[1], span2[1])];
          spans.splice(j, 1);
          j--;
          anyMerge = true;
        }
      }
    }

    return anyMerge;
  };

  while (mergeSpans());
 

  let totalIds = spans.map(s => (1 + s[1] - s[0])).reduce((a, b) => a + b, 0);

  console.log(totalIds);


  endTimer();
}

run();