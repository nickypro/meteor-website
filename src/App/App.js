import React from 'react'
import MeteorApp from './pages//MeteorApp'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const App = () => {
  return (
  <Router>
    <Switch>
      <Route path="/about" render={() => <div>about</div>} />
      <Route path="/" component={MeteorApp} />
    </Switch>
  </Router>
  )
}

export default App