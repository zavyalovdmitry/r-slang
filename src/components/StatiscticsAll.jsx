import React from 'react';
import {VictoryChart, VictoryLine, VictoryScatter} from 'victory';

import STATS from '../testData'

// const data = [
//    { x: 0, y: 0 },
//    { x: 1, y: 2 },
//    { x: 2, y: 1 },
//    { x: 3, y: 4 },
//    { x: 4, y: 3 },
//    { x: 5, y: 5 }
//  ];

const formatDataByDays = (stats) => {
   let output = [];
   for (let key in stats.optional) {
      output.push({x: key, y: stats.optional[key].learnedWords})
   };
   return output;
}

const formatDataCumul = (stats) => {
   let output = [];
   let d = 0;
   for (let key in stats.optional) {
      d += stats.optional[key].learnedWords;
      output.push({x: key, y: d});
   };
   return output;
}

const StatiscticsAll = ({dataSet}) => (
 <article>
    За весь период обучения
   <div className='stats-graphs-wrapper'>
      <VictoryChart>
         <VictoryLine
            interpolation={"linear"} data={formatDataByDays(STATS)}
            style={{ data: { stroke: "#c43a31" } }}
         />
         <VictoryScatter 
            data={formatDataByDays(STATS)}
            style={{ data: { fill: "#c43a31" } }}
         />
      </VictoryChart>
      <VictoryChart>
         <VictoryLine
            interpolation={"linear"} data={formatDataCumul(STATS)}
            style={{ data: { stroke: "#c43a31" } }}
         />
         <VictoryScatter 
            data={formatDataCumul(STATS)}
            style={{ data: { fill: "#c43a31" } }}
         />
      </VictoryChart>
   </div>
   
 </article>
);

export default StatiscticsAll;
