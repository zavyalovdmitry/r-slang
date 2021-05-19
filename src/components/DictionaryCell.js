import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import audioIMG from '../assets/image/audio.svg';
import langAudio from './LangAudio';
import SettingsContext from './SettingsContext';
/* eslint-disable */
export default class DictionaryCell extends Component {
  static contextType = SettingsContext;

  render = () => {
    const { data, changeWordStatus, classStyle } = this.props;
    const {
      id,
      _id,
      word,
      image,
      audioMeaning,
      audio,
      audioExample,
      textMeaning,
      textExample,
      transcription,
      wordTranslate,
      textMeaningTranslate,
      textExampleTranslate,
      userWord
    } = data;

    let global = 0;
    let series = 0;
    let wrong = 0;
    let conditionDifficulty = false;
    let difficulty = '';

    if (userWord !== undefined) {
      difficulty = userWord.difficulty;
      conditionDifficulty = ['success', 'del'].includes(difficulty);
      if (!conditionDifficulty) {
        global = userWord.optional.global;
        series = userWord.optional.series;
        wrong = userWord.optional.wrong;
      }
    }

    const action = changeWordStatus !== undefined ? changeWordStatus : false;
    const { wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible } =
      this.context;

    const playAudio = (audioName) => {
      langAudio.src = LangApi.homeApi + audioName;
      langAudio.play();
    };

    return (
      <div id={id || _id} className={`word-item ${classStyle !== null ? classStyle : ''}`}>
        <div className="word-item__img-wrap">
          <img src={LangApi.homeApi + image} alt="word-item" />
        </div>
        <div className="word-item__info">
          <div className="word-item__title-block">
            <h2 className="word-item__title-eng">{word}</h2>
            <p className="word-item__title-transcription">{transcription}</p>
            <img
              className="word-item__title-sound"
              src={audioIMG}
              onClick={() => playAudio(audio)}
              alt="item-sound"
            />
            <span className="word-item__title-slash">/</span>
            <h3 className="word-item__title-translate">
              {wordTranslateVisible.value && wordTranslate}
            </h3>
          </div>
          <div className="word-item__examples">
            <h3 className="word-item__examples-title">Примеры:</h3>
            <p>
              <img src={audioIMG} onClick={() => playAudio(audioMeaning)} alt="play-meaning" />
              <span dangerouslySetInnerHTML={{ __html: `${textMeaning}` }} />
            </p>
            {textTranslateVisible.value && <p className="word">{textMeaningTranslate}</p>}
            <p>
              <img src={audioIMG} onClick={() => playAudio(audioExample)} alt="play-example" />
              <span dangerouslySetInnerHTML={{ __html: `${textExample}` }} />
            </p>
            {textTranslateVisible.value && <p className="word">{textExampleTranslate}</p>}
          </div>
        </div>
        <div className="word-item__right-block">
          {!conditionDifficulty && (
            <p className="word-item__status">
              <span>Участвовало в игре: {global}</span>
              <span>Ошибок: {wrong}</span>
              <span>Текущая безошибочная череда: {series}</span>
            </p>
          )}
          {action !== false && (
            <div className="word-item__btn-block">
              {hardWordVisible.value && (
                <button type="button" className="word-item__btn" onClick={() => action(false)}>
                  {difficulty === 'hard' ? 'easy' : 'hard'}
                </button>
              )}
              {deleteWordVisible.value && (
                <button type="button" className="word-item__btn" onClick={() => action(true)}>
                  {difficulty === 'del' || difficulty === 'success' ? 'return' : 'delete'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
}

DictionaryCell.propTypes = {
  data: PropTypes.object.isRequired,
  classStyle: PropTypes.string,
  changeWordStatus: PropTypes.func
};
