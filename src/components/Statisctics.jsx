import React from 'react';
import StatiscticsByDay from './StatiscticsByDay';
import StatiscticsAll from './StatiscticsAll';

const stats = {
   "learnedWords": 0,
   "optional": {
       "2020-01-01": {
           "game-1": {
               "learnedWords": 0,
               "serries": 0,
               "outputsWords":0,
               "trues":0
           },
           "game-2": {
               "learnedWords": 0,
               "serries": 0,
               "outputsWords":0,
               "trues":0
           },
           "game-3": {
               "learnedWords": 0,
               "serries": 0,
               "outputsWords":0,
               "trues":0
           },
           "game-4": {
               "learnedWords": 0,
               "serries": 0,
               "outputsWords":0,
               "trues":0
           }
       }
   }
}

const Statisctics = () => (
   <>
      <StatiscticsByDay />
      <StatiscticsAll />
   </>
);

export default Statisctics;
