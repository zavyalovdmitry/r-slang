import React, {
  useEffect,
  useState,
} from 'react';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';

const StatiscticsByDay = ({ dataSet, dates }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(dates[dates.length - 1]);
  }, []);

  const formatDataByDays = (stats, date, keyParam) => {
    const output = [];
    for (const key in stats.optional[date]) {
      output.push(stats.optional[date][key][keyParam]);
    }
    output.splice(0, 1);
    output.push(stats.optional[date][keyParam]);
    return output;
  };

  const getPercents = () => {
    const outputs = formatDataByDays(dataSet, date, 'outputsWords');
    const trues = formatDataByDays(dataSet, date, 'trues');
    const res = [];

    outputs.splice(-1, 1);
    trues.splice(-1, 1);

    outputs.push(outputs.reduce((a, b) => a + b, 0));
    trues.push(trues.reduce((a, b) => a + b, 0));

    for (let i = 0; i < trues.length; i++) {
      res.push(Math.ceil(100 * trues[i] / outputs[i]) ? `${Math.ceil(100 * trues[i] / outputs[i])}%` : '-');
    }
    return (res);
  };

  const getMaxes = () => {
    const serries = formatDataByDays(dataSet, date, 'serries');

    serries.splice(-1, 1);

    serries.push(Math.max(...serries));

    return (serries);
  };

  return (
      <article>
         За
         {/* {date ?  */}
            <SplitButton
               id={'dropdown-split-variants-Secondary'}
               variant='Secondary'
               title={date || 'выберите дату'}
            >
               {dates.map((el) => (
                     <Dropdown.Item
                        key={el}
                        eventKey={el}
                        onSelect={(eventKey) => {
                          setDate(eventKey);
                        }}>
                           {el}
                     </Dropdown.Item>
               ))}
            </SplitButton>
         {/* : ' краткосрочный период пока нет данных...'}      */}

         {date ? <Table striped bordered hover>
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
                  {formatDataByDays(dataSet, date, 'learnedWords').map((el, key) => (
                        <td key={key}>
                           {el}{' шт.'}
                        </td>
                  ))}
               </tr>
               <tr>
                  <td>Верных ответов</td>
                  {getPercents().map((el, key) => (
                        <td key={key}>
                           {el}
                        </td>
                  ))}
               </tr>
               <tr>
                  <td>Максимальная серия</td>
                  {getMaxes().map((el, key) => (
                        <td key={key}>
                           {el}{' шт.'}
                        </td>
                  ))}
               </tr>
            </tbody>
         </Table>
           : ''}
      </article>
  );
};

export default StatiscticsByDay;
