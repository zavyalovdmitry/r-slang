import React, { Component } from 'react';
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
      id, word, image, audioMeaning, audio, audioExample, textMeaning, textExample, transcription, wordTranslate, textMeaningTranslate, textExampleTranslate,
    } = this.props.data;

    const {
      wordTranslateVisible, textTranslateVisible, /* deleteWordVisible, hardWordVisible, */
    } = this.context;

    const playAudio = (audioName) => {
      langAudio.src = LangApi.homeApi + audioName;
      langAudio.play();
    };

    return (
      <div id={id} className='wordBlock'>
        <div className='wordIMG'>
          <img src={LangApi.homeApi + image} />
        </div>
        <p className='word'>
          <span>
            {word}
            <img src={audioIMG} onClick={() => playAudio(audio)} />
          </span>
          <span>{transcription}</span>
          {wordTranslateVisible.value && <span>{wordTranslate}</span>}
        </p>
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
    );
  }
}

DictionaryCell.propTypes = {
  data: PropTypes.object.isRequired,
};
