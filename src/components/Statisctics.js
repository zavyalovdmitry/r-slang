import React, { useEffect, useState, useContext } from 'react';
import StatiscticsByDay from './StatiscticsByDay';
import StatiscticsAll from './StatiscticsAll';
import LangApi from './LangApi';
import SettingsContext from './SettingsContext';

const Statisctics = () => {
  const [data, setData] = useState({});
  const [dates, setDates] = useState([]);
  const context = useContext(SettingsContext);

  const getDates = (stats) => (stats.optional ? Object.keys(stats.optional) : []);

  useEffect(() => {
    LangApi.getGameStatistic(context.user.userId, context.user.token).then((datas) => {
      setData(datas);
    });
  }, []);

  useEffect(() => {
    setDates(getDates(data));
  }, [data]);

  return (
    <div className="statistics-wrapper">
      <StatiscticsByDay dataSet={data} dates={dates} />
      <StatiscticsAll dataSet={data} />
    </div>
  );
};

export default Statisctics;
