import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LangProvider } from './i18n/lang';
import Home from './pages/Home';
import Invitation from './pages/Invitation';
import AdminApp from './pages/admin/AdminApp';
import './styles/home.css';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/w/:slug" element={<Invitation />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  </StrictMode>,
);
