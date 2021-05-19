import React from 'react';

const Video = () => (
  <article className="video">
    <h2 className="video-title">Что делать?</h2>
    <p className="video-sub-title">А вот глянь видосик:</p>
    <div className="video-wrap">
      <div className="video-inner">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/jVOos5fauOU"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  </article>
);

export default Video;
