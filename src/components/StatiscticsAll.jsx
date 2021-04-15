import React from 'react';
import {VictoryChart, VictoryLine, VictoryScatter, VictoryLabel} from 'victory';

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
         <VictoryChart 
            animate={{ duration: 1000 }} 
            maxDomain={formatDataByDays(dataSet).reduce((accum,item) => accum + item.y, 0) === 0 ? 
               {y: 1} : ''}
         >
            <VictoryLabel text="Ежедневный прогресс" x={225} y={30} textAnchor="middle"/>
            <VictoryLine
               interpolation={"linear"} data={formatDataByDays(dataSet)}
               style={{ data: { stroke: "#c43a31" } }}
            />
            <VictoryScatter 
               data={formatDataByDays(dataSet)}
               style={{ data: { fill: "#c43a31" } }}
            />
         </VictoryChart>
         <VictoryChart 
            animate={{ duration: 1000 }}
            maxDomain={formatDataCumul(dataSet).reduce((accum,item) => accum + item.y, 0) === 0 ? 
               {y: 1} : ''}
         >
            <VictoryLabel text="Общий прогресс" x={225} y={30} textAnchor="middle"/>
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
