/* Implement the algorithms for analyzing the responses of a specific survey run
 */

/* Team efficiency
 * Input: Array (#responders) of array (3 questions) of numbers (answers, i.e. 0-4)
 * Output: integer: 0-100 (no decimal points)
 */
const analyzeEfficiency = (responses) => {
  //alg.specific
  if (responses[0].length !== 3) {
    throw new Error("Unexpected number of responses for efficiency estimation: " + responses[0].length);
  }

  //E1 + (4-E2) + E3
  const sumAll = responses.reduce((acc, response) => {
    return acc + (response[0] + (4-response[1]) + response[2])
  }, 0);

  //Average over three questions and #responders
  //=> range 0-4
  const avgAll = sumAll / (3 * responses.length);

  //Scale output
  return Math.round(100 * avgAll / 4);
}


/* Team maturity (stage matching)
 * Input: Array (#responders) of array (13 questions) of numbers (answers, i.e. 0-4); 
 * Output: Array with four results in the range [0-100], one for each "category":
 *         [0]: "Dependency and Inclusion" ,
 *         [1]: "Counter-Dependency and Fight",
 *         [2]: "Trust and Structure",
 *         [3]: "Work and Productivity"
 */
const analyzeMaturity = (responses) => {
  //alg.specific
  if (responses[0].length !== 13) {
    throw new Error("Unexpected number of responses for maturity matching: " + responses[0].length);
  }
  
  //[0]: "Dependency and Inclusion" (questions 1, 5, 9 and 13)
  const r0 = computePercentile(avgSumQ(responses, [0,4,8,12]), interval0);
  
  //[1]: "Counter-Dependency and Fight" (questions 2,6 and 10)
  const r1 = computePercentile(avgSumQ(responses, [1,5,9]), interval1);

  //[2]: "Trust and Structure" (questions 3,7 and 11)
  const r2 = computePercentile(avgSumQ(responses, [2,6,10]), interval2);

  //[3]: "Work and Productivity" (questions 4,8,12)
  const r3 = computePercentile(avgSumQ(responses, [3,7,11]), interval3);

  return [r0, r1, r2, r3];  
}

/* Add-on/helper for team maturity (stage matching)
 * Input: Maturity array (output from analyzeMaturity); 
 * Output: Array with "matching" stage(s), 1-4, sorted in increasing numerical order
 *         (array length may vary between 0 and 4, depending on results)
 */
const matchedMaturityStages = (maturityAnalysis) => {
  if (!maturityAnalysis || maturityAnalysis.length !==4) {
    return [];
  }
  //A "match" is defined by a result value >= 75
  //Special case: [3,4] -> [4]
  //- Teams in stage 4 are expected to also match aspects of stage 3
  const rawMatch = maturityAnalysis.reduce((acc, v, i) => (v >= 75) ? acc.concat(i + 1) : acc, []);    
  const match34 = rawMatch.length === 2 && rawMatch[0] === 3;
  return match34 ? [4] : rawMatch;
}

//Helper for summing specific questions for each responder
//- specified question-indexes and answers are zero-based (!)
//- but the answers are summed with +1 (treated as range 1-5)
const avgSumQ = (responses, qIxArray) => {
  const sumAll = responses.reduce((totAcc, resp) => 
    totAcc + qIxArray.reduce((acc, ix) =>
      acc + (1 + resp[ix]),
      0),
    0);

  return sumAll / responses.length
} 
  
    
//Helper for computing a value's ratio within an interval
//ratio range [0-1], 0==range min, 1==range max 
const rangeRatio = (val, min, max) => {
  //assume sane data here, i.e. no checks <min or >max
  return (val - min) / (max - min);
}

//The normalization is simplified by linear interpolation within
//a specific percentile interval, with different values for
//different categories (based on study results from 2.5K+ teams)
//The array order is: [min, 16th, 25th, mean, 75th, 84th, max]
const indexValues = [0, 16, 25, 50, 75, 84, 100];
const interval0 = [ 4.00,  7.80,  8.30,  9.65, 11.00, 11.61, 20.00];
const interval1 = [ 3.00,  5.29,  5.92,  7.37,  8.75,  9.60, 15.00];
const interval2 = [ 3.00,  8.83,  9.50, 10.65, 12.00, 12.57, 15.00];
const interval3 = [ 3.00,  9.93, 10.50, 11.34, 12.50, 13.00, 15.00];


//Helper for determining the applicable interval index for a value
//- interval must an sorted array
const getMinIndex = (value, interval) => {
  return interval.reduce((ix, v,i) => value > v ? i : ix, 0);
}

//Helper for computing the interpolated percentile from a result value (average)
//Return rounded values in range [0-100] (0 decimals)
const computePercentile = (value, interval) => {
  const minIx = getMinIndex(value, interval);
  const min = interval[minIx];
  const max = interval[minIx+1];
  const intervalBase = indexValues[minIx];
  const intervalLength = indexValues[minIx + 1] - intervalBase;
  return Math.round(intervalBase + rangeRatio(value, min, max) * intervalLength);
}

export { analyzeEfficiency, analyzeMaturity, matchedMaturityStages };