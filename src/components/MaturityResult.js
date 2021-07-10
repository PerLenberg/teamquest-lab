import React from "react";
import ResultPie from "./ResultPie";
import ResultInterpretation from "./ResultInterpretation";

import "./MaturityResult.css";

const labels = [
  "1. Dependency and Inclusion",
  "2. Counter-Dependency and Fight",
  "3. Trust and Structure",
  "4. Work and Productivity"
];

const descriptions = [
  "This is the forming stage of a team",
  "This is the storming stage of a team",
  "This is the norming stage of a team",
  "This is the performing stage of a team",
];

const color = "var(--color-result-m)";

const categoryClass = "MaturityResult-category"
const matchedCategoryClass = `${categoryClass} matched`
const descrClass = "MaturityResult-description";
const disabledDescrClass = `${descrClass} disabled`;

const MaturityResult = ({ resultData, ongoing }) => {
  const data = resultData || [0, 0, 0, 0];

  return <div className="MaturityResult">
    {ongoing
      ? <h4>Matching stages...</h4>  
      : <ResultInterpretation resultData={resultData}/>
    }
    <div className="MaturityResult-graph-container">
      {data.map((value, index) => (
        <div key={index} className={value > 75 ? matchedCategoryClass : categoryClass}>
          <ResultPie
            value={value}
            max={100}
            color={color}
            opacity={value > 75 ? "1.0" : "0.2"}
            textColor={value > 75 ? color : "var(--color-result-nomatch)"}
          />
          <div className={resultData ? descrClass : disabledDescrClass}>
            <span><p>{labels[index]}</p></span>
            <p>{descriptions[index]}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
};

export default MaturityResult;
