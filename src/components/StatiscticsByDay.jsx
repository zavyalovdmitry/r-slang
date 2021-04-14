import React, {
   useState } from 'react';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';
import STATS from '../testData';

const getDates = (stats) => {
   let output = [];
   for (let key in stats.optional) {
      output.push(key)
   };
   return output;
}

const dates = getDates(STATS);

const StatiscticsByDay = () => {
   const [date, setDate] = useState(dates[dates.length - 1]);
      
   const formatDataByDays = (stats, date, keyParam) => {
      let output = [];
      for (let key in stats.optional[date]) {
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

   return(
      <article>
         За 
         <SplitButton
            id={`dropdown-split-variants-Secondary`}
            variant='Secondary'
            title={date}
         >
            {dates.map((el) => {
               return(
                  <Dropdown.Item 
                     key={el}
                     eventKey={el} 
                     onSelect={(eventKey) => {
                        setDate(eventKey);
                     }}>
                        {el}
                  </Dropdown.Item>
               )
            })}
         </SplitButton>

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
   )
};

export default StatiscticsByDay;
