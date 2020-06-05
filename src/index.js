import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App'
import 'regenerator-runtime/runtime'
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>
  ,
  document.getElementById('root')
);