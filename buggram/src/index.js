import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';

firebase.initializeApp({
	apiKey: "AIzaSyA1zgI71xV_VwYSNijI2_0-h_fpI4nbNv0",
    authDomain: "buggram-aecee.firebaseapp.com",
    databaseURL: "https://buggram-aecee.firebaseio.com",
    projectId: "buggram-aecee",
    storageBucket: "buggram-aecee.appspot.com",
    messagingSenderId: "593230134973"
});

  


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
