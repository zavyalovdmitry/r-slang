import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LangApi from './LangApi';
import audioIMG from '../assets/image/audio.svg';
import langAudio from './LangAudio';
import SettingsContext from './SettingsContext';

export default class DictionaryCell extends Component {
  static contextType = SettingsContext;

  render = () => {
    const {
      // eslint-disable-next-line max-len
      id, _id, word, image, audioMeaning, audio, audioExample, textMeaning, textExample, transcription, wordTranslate, textMeaningTranslate, textExampleTranslate,
    } = this.props.data;
    const action = this.props.changeWordStatus !== undefined ? this.props.changeWordStatus : false;

    const {
      wordTranslateVisible, textTranslateVisible, deleteWordVisible, hardWordVisible,
    } = this.context;

    const playAudio = (audioName) => {
      langAudio.src = LangApi.homeApi + audioName;
      langAudio.play();
    };
    return (
      <div id={id || _id} className={`word-item ${this.props.classStyle !== null ? this.props.classStyle : ''}`} >
        <div className='word-item__img-wrap'>
          <img src={LangApi.homeApi + image} />
        </div>
        <div className="word-item__info">
          <div className="word-item__title-block">
            <h2 className="word-item__title-eng">{word}</h2>
            <p className="word-item__title-transcription">{transcription}</p>
            <img className="word-item__title-sound" src={audioIMG} onClick={() => playAudio(audio)} />
            <span className="word-item__title-slash">/</span>
            <h3 className="word-item__title-translate">{wordTranslateVisible.value && wordTranslate}</h3>
          </div>
          <div className="word-item__examples">
            <h3 className="word-item__examples-title">Примеры:</h3>
            <p>
              <img src={audioIMG} onClick={() => playAudio(audioMeaning)} />
              <span dangerouslySetInnerHTML={{ __html: `${textMeaning}` }} />
            </p>
            {textTranslateVisible.value && <p className='word'>{textMeaningTranslate}</p>}
            <p>
              <img src={audioIMG} onClick={() => playAudio(audioExample)} />
              <span dangerouslySetInnerHTML={{ __html: `${textExample}` }} />
            </p>
            {textTranslateVisible.value && <p className='word'>{textExampleTranslate}</p>}
          </div>
        </div>
        {
              action !== false
              && <Fragment>
                    {hardWordVisible.value && <button onClick={() => action(true)}>hard</button>}
                    { // eslint-disable-next-line max-len
                      deleteWordVisible.value && <button onClick={() => action(false)}> delete</button>}
                </Fragment>
            }
             <p className='status'><span>Участвовало в игре: 0</span><span>Ошибок: 0</span><span>Текущая безошибочная череда: 0</span></p>
      </div>
    );
  }
}

DictionaryCell.propTypes = {
  data: PropTypes.object.isRequired,
  classStyle: PropTypes.string,
  changeWordStatus: PropTypes.func,
};
