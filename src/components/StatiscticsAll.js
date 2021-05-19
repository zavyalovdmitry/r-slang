import React from 'react';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryLabel } from 'victory';
/* eslint-disable */
// const formatDataByDays = (stats) => {
//   return stats.optional ? Object.keys(stats.optional) : [];
// };

const formatDataByDays = (stats) => {
  const output = [];
  for (const key in stats.optional) {
    output.push({ x: key, y: stats.optional[key].learnedWords });
  }
  return output;
};

const formatDataCumul = (stats) => {
  const output = [];
  let d = 0;
  for (const key in stats.optional) {
    d += stats.optional[key].learnedWords;
    output.push({ x: key, y: d });
  }
  return output;
};

const StatiscticsAll = ({ dataSet }) => {
  const data = formatDataByDays(dataSet);
  const dataCumul = formatDataCumul(dataSet);

  return (
    <article>
      За весь период обучения
      {data.length !== 1 ? (
        <div className="stats-graphs-wrapper">
          <VictoryChart
            animate={{ duration: 1000 }}
            maxDomain={
              data.reduce((accum, item) => accum + item.y, 0) === 0
                ? { y: 1 }
                : ''
            }
          >
            <VictoryLabel text="Ежедневный прогресс" x={225} y={30} textAnchor="middle" />
            <VictoryLine
              interpolation="linear"
              data={data}
              style={{ data: { stroke: '#c43a31' } }}
            />
            <VictoryScatter data={data} style={{ data: { fill: '#c43a31' } }} />
          </VictoryChart>
          <VictoryChart
            animate={{ duration: 1000 }}
            maxDomain={
              dataCumul.reduce((accum, item) => accum + item.y, 0) === 0
                ? { y: 1 }
                : ''
            }
          >
            <VictoryLabel text="Общий прогресс" x={225} y={30} textAnchor="middle" />
            <VictoryLine
              interpolation="linear"
              data={dataCumul}
              style={{ data: { stroke: '#c43a31' } }}
            />
            <VictoryScatter data={dataCumul} style={{ data: { fill: '#c43a31' } }} />
          </VictoryChart>
        </div>
      ) : (
        ' пока нет данных...'
      )}
    </article>
)};

export default StatiscticsAll;
