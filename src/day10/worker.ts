
process.on("message", (msg: { line:string[], index:number }) => {

    type SelectedButton = {
    index:number;
    buttons: number[];
  };

  type Equation = {
    index:number;
    buttonIndices: number[];
    sum:number;
  };

  const getEquation = (index:number, joltage:number[], buttons:number[][]):Equation => {

    let applicableButtonIndices = buttons.map((b, i) => { return { index: i, buttons: b} as SelectedButton})
                                          .filter(b => b.buttons.some(i => i === index))
                                          .map(b => b.index);

    return {
      index: index,
      buttonIndices: applicableButtonIndices,
      sum: joltage[index]
    } as Equation;
  };

  const sortEquations = (equations:Equation[]):Equation[] => {

    const result:Equation[] = [];
    const remaining = [...equations];
    const seen = new Set<number>();

    while (remaining.length > 0) {
      remaining.sort((a, b) => {
        const newButtons1 = a.buttonIndices.filter(n => !seen.has(n)).length;
        const newButtons2 = b.buttonIndices.filter(n => !seen.has(n)).length;

        if (newButtons1 === newButtons2) {
          return a.sum - b.sum;
        }

        return newButtons1 - newButtons2;
      });

      const next = remaining.shift()!;
      
      for (const n of next.buttonIndices) {
        seen.add(n);
      }

      result.push(next);
    }

    return result;
  }


  const currentJoltageInvalid = (buttons:number[][], targetJoltage:number[], currentPresses:(number|null)[], requireEquality:boolean):boolean => {

    let currentJoltage = targetJoltage.map(() => 0);

    for (let i = 0; i < currentPresses.length; i++) {
      if (currentPresses[i] != null) {
        for (let j = 0; j < buttons[i].length; j++) {
          currentJoltage[buttons[i][j]] += currentPresses[i]!;

          if (currentJoltage[buttons[i][j]] > targetJoltage[buttons[i][j]]) {
            return true;
          }
        }
      }
    }

    if (requireEquality) {
      for (let i = 0; i < currentJoltage.length; i++) {
        if (currentJoltage[i] != targetJoltage[i]) {
          return true;
        }
      }
    }

    return false;
  }
  
  const solveEquations = (equations:Equation[], currentEquationIndex:number, targetJoltage:number[], currentPresses:(number|null)[], buttons:number[][]):number => {

    //console.log(currentPresses);

    if (currentJoltageInvalid(buttons, targetJoltage, currentPresses, false)) {
      return Number.MAX_VALUE;
    }

    let presses = currentPresses.map(n => n!).reduce((sum, n) => sum + n, 0);

    if (currentEquationIndex === equations.length) {
      
      let presses = currentPresses.map(n => n!).reduce((sum, n) => sum + n, 0);
      let invalid = currentJoltageInvalid(buttons, targetJoltage, currentPresses, true);

      if (!invalid) {
        console.log(`(${index}) possible`, presses);
      }

      return invalid ? Number.MAX_VALUE : presses;
    }

    if (presses >= bestSolution) {
      return Number.MAX_VALUE;
    }

    let equation = equations[currentEquationIndex];
    //let bestSolution = Number.MAX_VALUE;

    const getLoopStartValue = (values:(number | null)[], index:number):number => values[index] === null ? 0 : values[index];
    const getLoopEndValue = (values:(number | null)[], index:number, equationSum:number):number => values[index] === null ? equationSum : values[index];
    const isValidValue = (values:(number | null)[], index:number, val:number):boolean => values[index] === null || values[index] === val;

    let values = equation.buttonIndices.map(v => currentPresses[v] ? currentPresses[v] : null);

    let maxi:number;
    let maxj:number;
    let maxk:number;
    let maxl:number;
    let maxm:number;
    let maxn:number;
    let maxo:number;
    let maxp:number;
    let maxq:number;
    let maxr:number;

    switch (equation.buttonIndices.length) {
      case 1: 
        if (isValidValue(values, 0, equation.sum)) {
          
          const newPresses = currentPresses.map(press => press);
          newPresses[equation.buttonIndices[0]] = equation.sum;

          bestSolution = Math.min(bestSolution, 
                                solveEquations(equations, 
                                              currentEquationIndex + 1, 
                                              targetJoltage,
                                              newPresses,
                                              buttons
                                ));
        }
        break;
      case 2: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        
        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          let j = (equation.sum - i);
          
          if (isValidValue(values, 1, j)) {
            const newPresses = currentPresses.map(press => press);
            newPresses[equation.buttonIndices[0]] = i;
            newPresses[equation.buttonIndices[1]] = j;
            bestSolution = Math.min(bestSolution, 
                                    solveEquations(equations, 
                                                  currentEquationIndex + 1, 
                                                  targetJoltage, 
                                                  newPresses,
                                                  buttons
            ));
          }
        }
        break;
      case 3: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            let k = (equation.sum - i - j);
            
            if (isValidValue(values, 2, k)) {
              const newPresses = currentPresses.map(press => press);
              newPresses[equation.buttonIndices[0]] = i;
              newPresses[equation.buttonIndices[1]] = j;
              newPresses[equation.buttonIndices[2]] = k;
              bestSolution = Math.min(bestSolution, 
                                      solveEquations(equations, 
                                                    currentEquationIndex + 1, 
                                                    targetJoltage, 
                                                    newPresses,
                                                    buttons
              ));
            }
          }
        }
        break;
      case 4: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              let l = (equation.sum - i - j - k);
              
              if (isValidValue(values, 3, l)) {
                const newPresses = currentPresses.map(press => press);
                newPresses[equation.buttonIndices[0]] = i;
                newPresses[equation.buttonIndices[1]] = j;
                newPresses[equation.buttonIndices[2]] = k;
                newPresses[equation.buttonIndices[3]] = l;
                bestSolution = Math.min(bestSolution, 
                                        solveEquations(equations, 
                                                      currentEquationIndex + 1, 
                                                      targetJoltage, 
                                                      newPresses,
                                                      buttons
                ));
              }
            }
          }
        }
        break;
      case 5: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                let m = (equation.sum - i - j - k - l);
                
                if (isValidValue(values, 4, m)) {
                  const newPresses = currentPresses.map(press => press);
                  newPresses[equation.buttonIndices[0]] = i;
                  newPresses[equation.buttonIndices[1]] = j;
                  newPresses[equation.buttonIndices[2]] = k;
                  newPresses[equation.buttonIndices[3]] = l;
                  newPresses[equation.buttonIndices[4]] = m;
                  bestSolution = Math.min(bestSolution, 
                                          solveEquations(equations, 
                                                        currentEquationIndex + 1, 
                                                        targetJoltage, 
                                                        newPresses,
                                                        buttons
                  ));
                }
              }
            }
          }
        }
        break;
      case 6: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  let n = (equation.sum - i - j - k - l - m);
                  
                  if (isValidValue(values, 5, n)) {
                    const newPresses = currentPresses.map(press => press);
                    newPresses[equation.buttonIndices[0]] = i;
                    newPresses[equation.buttonIndices[1]] = j;
                    newPresses[equation.buttonIndices[2]] = k;
                    newPresses[equation.buttonIndices[3]] = l;
                    newPresses[equation.buttonIndices[4]] = m;
                    newPresses[equation.buttonIndices[5]] = n;
                    bestSolution = Math.min(bestSolution, 
                                            solveEquations(equations, 
                                                          currentEquationIndex + 1, 
                                                          targetJoltage, 
                                                          newPresses,
                                                          buttons
                    ));
                  }
                }
              }
            }
          }
        }
        break;
      case 7: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);
        maxn = getLoopEndValue(values, 5, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  for (let n = getLoopStartValue(values, 5); n <= Math.min(maxn, equation.sum - i - j - k - l - m); n++)
                  {
                    let o = (equation.sum - i - j - k - l - m - n);
                    
                    if (isValidValue(values, 6, o)) {
                      const newPresses = currentPresses.map(press => press);
                      newPresses[equation.buttonIndices[0]] = i;
                      newPresses[equation.buttonIndices[1]] = j;
                      newPresses[equation.buttonIndices[2]] = k;
                      newPresses[equation.buttonIndices[3]] = l;
                      newPresses[equation.buttonIndices[4]] = m;
                      newPresses[equation.buttonIndices[5]] = n;
                      newPresses[equation.buttonIndices[6]] = o;
                      bestSolution = Math.min(bestSolution, 
                                              solveEquations(equations, 
                                                            currentEquationIndex + 1, 
                                                            targetJoltage, 
                                                            newPresses,
                                                            buttons
                      ));
                    }
                  }
                }
              }
            }
          }
        }
        break;
      case 8: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);
        maxn = getLoopEndValue(values, 5, equation.sum);
        maxo = getLoopEndValue(values, 6, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  for (let n = getLoopStartValue(values, 5); n <= Math.min(maxn, equation.sum - i - j - k - l - m); n++)
                  {
                    for (let o = getLoopStartValue(values, 6); o <= Math.min(maxo, equation.sum - i - j - k - l - m - n); o++)
                    {
                      let p = (equation.sum - i - j - k - l - m - n - o);
                      
                      if (isValidValue(values, 7, p)) {
                        const newPresses = currentPresses.map(press => press);
                        newPresses[equation.buttonIndices[0]] = i;
                        newPresses[equation.buttonIndices[1]] = j;
                        newPresses[equation.buttonIndices[2]] = k;
                        newPresses[equation.buttonIndices[3]] = l;
                        newPresses[equation.buttonIndices[4]] = m;
                        newPresses[equation.buttonIndices[5]] = n;
                        newPresses[equation.buttonIndices[6]] = o;
                        newPresses[equation.buttonIndices[7]] = p;
                        bestSolution = Math.min(bestSolution, 
                                                solveEquations(equations, 
                                                              currentEquationIndex + 1, 
                                                              targetJoltage, 
                                                              newPresses,
                                                              buttons
                        ));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        break;
      case 9: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);
        maxn = getLoopEndValue(values, 5, equation.sum);
        maxo = getLoopEndValue(values, 6, equation.sum);
        maxp = getLoopEndValue(values, 7, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  for (let n = getLoopStartValue(values, 5); n <= Math.min(maxn, equation.sum - i - j - k - l - m); n++)
                  {
                    for (let o = getLoopStartValue(values, 6); o <= Math.min(maxo, equation.sum - i - j - k - l - m - n); o++)
                    {
                      for (let p = getLoopStartValue(values, 7); p <= Math.min(maxp, equation.sum - i - j - k - l - m - n - o); p++)
                      {
                        let q = (equation.sum - i - j - k - l - m - n - o - p);
                        
                        if (isValidValue(values, 8, q)) {
                          const newPresses = currentPresses.map(press => press);
                          newPresses[equation.buttonIndices[0]] = i;
                          newPresses[equation.buttonIndices[1]] = j;
                          newPresses[equation.buttonIndices[2]] = k;
                          newPresses[equation.buttonIndices[3]] = l;
                          newPresses[equation.buttonIndices[4]] = m;
                          newPresses[equation.buttonIndices[5]] = n;
                          newPresses[equation.buttonIndices[6]] = o;
                          newPresses[equation.buttonIndices[7]] = p;
                          newPresses[equation.buttonIndices[8]] = q;
                          bestSolution = Math.min(bestSolution, 
                                                  solveEquations(equations, 
                                                                currentEquationIndex + 1, 
                                                                targetJoltage, 
                                                                newPresses,
                                                                buttons
                          ));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        break;
    case 10: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);
        maxn = getLoopEndValue(values, 5, equation.sum);
        maxo = getLoopEndValue(values, 6, equation.sum);
        maxp = getLoopEndValue(values, 7, equation.sum);
        maxq = getLoopEndValue(values, 8, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  for (let n = getLoopStartValue(values, 5); n <= Math.min(maxn, equation.sum - i - j - k - l - m); n++)
                  {
                    for (let o = getLoopStartValue(values, 6); o <= Math.min(maxo, equation.sum - i - j - k - l - m - n); o++)
                    {
                      for (let p = getLoopStartValue(values, 7); p <= Math.min(maxp, equation.sum - i - j - k - l - m - n - o); p++)
                      {
                        for (let q = getLoopStartValue(values, 8); q <= Math.min(maxq, equation.sum - i - j - k - l - m - n - o - p); q++)
                        {
                            let r = (equation.sum - i - j - k - l - m - n - o - p - q);
                            
                            if (isValidValue(values, 9, r)) {
                                const newPresses = currentPresses.map(press => press);
                                newPresses[equation.buttonIndices[0]] = i;
                                newPresses[equation.buttonIndices[1]] = j;
                                newPresses[equation.buttonIndices[2]] = k;
                                newPresses[equation.buttonIndices[3]] = l;
                                newPresses[equation.buttonIndices[4]] = m;
                                newPresses[equation.buttonIndices[5]] = n;
                                newPresses[equation.buttonIndices[6]] = o;
                                newPresses[equation.buttonIndices[7]] = p;
                                newPresses[equation.buttonIndices[8]] = q;
                                newPresses[equation.buttonIndices[9]] = r;
                                bestSolution = Math.min(bestSolution, 
                                                        solveEquations(equations, 
                                                                        currentEquationIndex + 1, 
                                                                        targetJoltage, 
                                                                        newPresses,
                                                                        buttons
                                ));
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        break;
    case 11: 
        maxi = getLoopEndValue(values, 0, equation.sum);
        maxj = getLoopEndValue(values, 1, equation.sum);
        maxk = getLoopEndValue(values, 2, equation.sum);
        maxl = getLoopEndValue(values, 3, equation.sum);
        maxm = getLoopEndValue(values, 4, equation.sum);
        maxn = getLoopEndValue(values, 5, equation.sum);
        maxo = getLoopEndValue(values, 6, equation.sum);
        maxp = getLoopEndValue(values, 7, equation.sum);
        maxq = getLoopEndValue(values, 8, equation.sum);
        maxr = getLoopEndValue(values, 9, equation.sum);

        for (let i = getLoopStartValue(values, 0); i <= maxi; i++)
        {
          for (let j = getLoopStartValue(values, 1); j <= Math.min(maxj, equation.sum - i); j++)
          {
            for (let k = getLoopStartValue(values, 2); k <= Math.min(maxk, equation.sum - i - j); k++)
            {
              for (let l = getLoopStartValue(values, 3); l <= Math.min(maxl, equation.sum - i - j - k); l++)
              {
                for (let m = getLoopStartValue(values, 4); m <= Math.min(maxm, equation.sum - i - j - k - l); m++)
                {
                  for (let n = getLoopStartValue(values, 5); n <= Math.min(maxn, equation.sum - i - j - k - l - m); n++)
                  {
                    for (let o = getLoopStartValue(values, 6); o <= Math.min(maxo, equation.sum - i - j - k - l - m - n); o++)
                    {
                      for (let p = getLoopStartValue(values, 7); p <= Math.min(maxp, equation.sum - i - j - k - l - m - n - o); p++)
                      {
                        for (let q = getLoopStartValue(values, 8); q <= Math.min(maxq, equation.sum - i - j - k - l - m - n - o - p); q++)
                        {
                            for (let r = getLoopStartValue(values, 9); r <= Math.min(maxr, equation.sum - i - j - k - l - m - n - o - p - q); r++)
                            {
                                let s = (equation.sum - i - j - k - l - m - n - o - p - q - r);
                                
                                if (isValidValue(values, 10, s)) {
                                    const newPresses = currentPresses.map(press => press);
                                    newPresses[equation.buttonIndices[0]] = i;
                                    newPresses[equation.buttonIndices[1]] = j;
                                    newPresses[equation.buttonIndices[2]] = k;
                                    newPresses[equation.buttonIndices[3]] = l;
                                    newPresses[equation.buttonIndices[4]] = m;
                                    newPresses[equation.buttonIndices[5]] = n;
                                    newPresses[equation.buttonIndices[6]] = o;
                                    newPresses[equation.buttonIndices[7]] = p;
                                    newPresses[equation.buttonIndices[8]] = q;
                                    newPresses[equation.buttonIndices[9]] = r;
                                    newPresses[equation.buttonIndices[10]] = s;
                                    bestSolution = Math.min(bestSolution, 
                                                            solveEquations(equations, 
                                                                            currentEquationIndex + 1, 
                                                                            targetJoltage, 
                                                                            newPresses,
                                                                            buttons
                                    ));
                                }
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        break;

      default: throw "unsupported equation size " + equation.buttonIndices.length
    }

    return bestSolution;
  };

    let joltage:number[] = [];
    let buttons:number[][] = [];
    let bestSolution:number = Number.MAX_VALUE;
    let line = msg.line;
    let index = msg.index;

    joltage.push(...line[line.length - 1].slice(1, -1).split(",").map(Number));

    line.slice(1, line.length - 1).forEach(button => {
      let indicators = button.substring(1, button.length - 1).split(",").map(Number);
      buttons.push(indicators);
    });
    
    let equations:Equation[] = [];

    for (let i = 0; i < joltage.length; i++) {
      equations.push(getEquation(i, joltage, buttons));
    }

    equations = sortEquations(equations);

    let clicks = solveEquations(equations, 0, joltage, buttons.map(() => null), buttons);

    process.send?.({ clicks, index });
});