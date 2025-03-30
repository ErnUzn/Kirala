import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Axios yapılandırması
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Request interceptor
axios.interceptors.request.use(
  config => {
    // Request gönderilmeden önce yapılacak işlemler
    console.log('Request yapılıyor:', config.url, config.data);
    return config;
  }, 
  error => {
    // Request hatası
    console.error('Request hatası:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    // Başarılı response
    console.log('Response başarılı:', response.status, response.data);
    return response;
  },
  error => {
    // Response hatası
    console.error('Response hatası:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
