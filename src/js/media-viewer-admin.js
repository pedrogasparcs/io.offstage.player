'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import s from './../sass/index.scss';

import MediaPlayer from './Components/MediaPlayer';

ReactDOM.render(
  <MediaPlayer
      api-key="admin"
      collection="admin"
  />,
  document.getElementById('index')
);
