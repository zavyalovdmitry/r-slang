import React, { useEffect, useState, useContext } from 'react';
import StatiscticsByDay from './StatiscticsByDay';
import StatiscticsAll from './StatiscticsAll';
import LangApi from './LangApi';
import SettingsContext from './SettingsContext';

// import STATS from'../testData'
// getGameStatistic(userId, token)


const Statisctics = () => {
   const [data, setData] = useState({});
   const [dates, setDates] = useState([]);
   const context = useContext(SettingsContext);

   // const loadStats = async() => {
   //    const dataSet = LangApi.getGameStatistic(context.user.userId, context.user.token);
   //    const datas = await dataSet;  
   //    setData(datas);
   // }

   const getDates = (stats) => {
      let output = [];
      for (let key in stats.optional) {
         output.push(key)
      };
      return output;
   }

   useEffect(() => {
      LangApi.getGameStatistic(context.user.userId, context.user.token)
         .then((datas) =>  {  
            setData(datas);   
         });
      // setDates(getDates(data));
      // loadStats();
   }, [])

   useEffect(() => {
      setDates(getDates(data));
      // loadStats();
   }, [data])

   // console.log(data)
   return <div className="statistics-wrapper">
      <StatiscticsByDay dataSet={data} dates={dates}/>
      <StatiscticsAll dataSet={data} /> 
   </div>
};

export default Statisctics;