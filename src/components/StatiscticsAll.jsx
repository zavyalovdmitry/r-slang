import React from 'react';
import {VictoryChart, VictoryLine, VictoryScatter} from 'victory';

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
   {formatDataByDays(dataSet).length !== 1 ? 
      <div className='stats-graphs-wrapper'>
         <VictoryChart>
            <VictoryLine
               interpolation={"linear"} data={formatDataByDays(dataSet)}
               style={{ data: { stroke: "#c43a31" } }}
            />
            <VictoryScatter 
               data={formatDataByDays(dataSet)}
               style={{ data: { fill: "#c43a31" } }}
            />
         </VictoryChart>
         <VictoryChart>
            <VictoryLine
               interpolation={"linear"} data={formatDataCumul(dataSet)}
               style={{ data: { stroke: "#c43a31" } }}
            />
            <VictoryScatter 
               data={formatDataCumul(dataSet)}
               style={{ data: { fill: "#c43a31" } }}
            />
         </VictoryChart>
      </div>
   : ' пока нет данных...'}
   
 </article>
);

export default StatiscticsAll;
