import { Router } from '@solidjs/router';
import { Component } from 'solid-js';
import { NavBar } from '../components/nav-bar';
import { AppRoutes } from '../screens/routes';

const App: Component = () => {
  return (
    <Router>
      <NavBar />
      <div class="main-content">
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
