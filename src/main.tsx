import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/learning-experience.css';
import './styles/junior-assessment.css';
import './styles/polish-foundation.css';
import './styles/p0b-home-shell.css';
import './styles/path-journey.css';
import './styles/accessibility.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
