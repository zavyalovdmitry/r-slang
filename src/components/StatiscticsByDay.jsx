import React from 'react';
import Table from 'react-bootstrap/Table';
import STATS from '../testData';

const formatDataByDays = (stats, date, keyParam) => {
   let output = [];
   for (let key in stats.optional[date]) {
      // output.push({x: key, y: stats.optional[key].learnedWords})
      output.push(stats.optional[date][key][keyParam])
   };
   output.splice(0, 1);
   output.push(stats.optional[date][keyParam]);
   return output;
}

const getPercents = () => {
   let outputs = formatDataByDays(STATS, date, 'outputsWords');
   let trues = formatDataByDays(STATS, date, 'trues');
   let res = [];

   outputs.splice(-1, 1);
   trues.splice(-1, 1);

   outputs.push(outputs.reduce((a, b) => a + b, 0));
   trues.push(trues.reduce((a, b) => a + b, 0));

   for (let i = 0; i < trues.length; i++) {
      res.push(Math.ceil(100 * trues[i] / outputs[i]));
   }
   return(res);
}

const getMaxes = () => {
   let serries = formatDataByDays(STATS, date, 'serries');

   serries.splice(-1, 1);

   serries.push(Math.max(...serries));

   return(serries);
}

const date = '2020-01-01';

const StatiscticsByDay = () => (
 <article>
   За {date}
   
   <Table striped bordered hover>
      <thead>
         <tr>
            <th></th>
            <th>Спринт</th>
            <th>Саванна</th>
            <th>Аудиовызов</th>
            <th>Конструктор</th>
            <th>Всего</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <td>Изучено слов</td>
            {formatDataByDays(STATS, date, 'learnedWords').map((el, key) => {
               return(
                  <td key={key}>
                     {el}{' шт.'}
                  </td>
               )
            })}
         </tr>
         <tr>
            <td>Верных ответов</td>
            {getPercents().map((el, key) => {
               return(
                  <td key={key}>
                     {el}{'%'}
                  </td>
               )
            })}
         </tr>
         <tr>
            <td>Максимальная серия</td>
            {getMaxes().map((el, key) => {
               return(
                  <td key={key}>
                     {el}{' шт.'}
                  </td>
               )
            })}
         </tr>
      </tbody>
   </Table>
 </article>
);

export default StatiscticsByDay;
