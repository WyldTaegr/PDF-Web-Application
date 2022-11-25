import React from 'react';
import { Amplify, Auth } from 'aws-amplify';
import ReactDOM from 'react-dom/client';
import App from './App';
import "antd/dist/antd.css";
import axios from "axios";
import awsExports from './aws-exports';

Amplify.configure(awsExports);
 
axios.defaults.withCredentials = true;
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);