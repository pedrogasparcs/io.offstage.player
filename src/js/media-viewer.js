'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import s from './../sass/index.sass';

import MediaPlayer from './Components/MediaPlayer';

ReactDOM.render(
  <MediaPlayer
      api-key="testing"
      channel="testing"
  />,
  document.getElementById('index')
);
