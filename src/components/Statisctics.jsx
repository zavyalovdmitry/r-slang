import React, { useEffect, useState, useContext } from 'react';
import StatiscticsByDay from './StatiscticsByDay';
import StatiscticsAll from './StatiscticsAll';
import LangApi from './LangApi';
import SettingsContext from './SettingsContext';

// import STATS from'../testData'
// getGameStatistic(userId, token)


const Statisctics = () => {
   const [data, setData] = useState({});
   const context = useContext(SettingsContext);

   useEffect(() => {
      LangApi.getGameStatistic(context.user.userId, context.user.token)
        .then((data) => data.json())
        .then((dataSet) => setData(dataSet));
   })

   console.log(data);

   return <div className="statistics-wrapper">
      <StatiscticsByDay dataSet={data}/>
      <StatiscticsAll dataSet={data} />
   </div>
};

export default Statisctics;