import React from 'react'
import MeteorApp from './pages/MeteorApp'
import StaticPage from './pages/StaticPage'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const staticList = [
  {name: "about", title:"About Us"},
  //{name: "test",  title:"Test Page"},
]

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const App = () => {
  return (  
  <ThemeProvider theme={theme}>
  <Router>
    <nav>
      <a>navigation</a>
    </nav>
    <Switch>
      {staticList.map(item => 
        <Route 
          key={item.name}
          path={`/${item.name}`} 
          render={() => <StaticPage name={item.name} title={item.title}/>} 
        />
      )}
      <Route path="/" component={MeteorApp} />
    </Switch>
  </Router>
  </ThemeProvider>
  )
}

export default App