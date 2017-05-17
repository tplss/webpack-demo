import 'react';
import 'font-awesome/css/font-awesome.css';
import 'purecss';
import './main.css';
import component from './component';
import { bake } from './shake';

bake();

if (process.env.NODE_ENV === 'development') {
  require('./demo');
}

document.body.appendChild(component());
