import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import {pauseOffscreenAnimations} from './pauseOffscreenAnimations.ts';

const container = document.getElementById('root')!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// 빌드 때 미리 만든 HTML이 있으면 그대로 이어받고(hydrate), 없으면(개발 화면·빈 주소) 새로 그림
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);

pauseOffscreenAnimations();
