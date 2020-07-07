import React from 'react';
import { render } from 'react-snapshot';
import App from './App/App'
import 'regenerator-runtime/runtime'
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>
  ,
  document.getElementById('root')
);