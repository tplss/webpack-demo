import 'react';
import 'font-awesome/css/font-awesome.css';
import 'purecss';
import './main.css';
import component from './component';
import { bake } from './shake';

//import logger from 'redux-logger';

//console.log(logger);

bake();

if (process.env.NODE_ENV === 'development') {
  require('redux-logger');
  require('./demo');
}

document.body.appendChild(component());
