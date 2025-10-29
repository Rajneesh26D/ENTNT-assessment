import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { worker } from './services/api';
import { seedDatabase } from './services/seed';

// Start MSW
async function enableMocking() {
  if (import.meta.env.MODE !== 'development')  {
    return;
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  console.log('🚀 MSW Started');
  
  await seedDatabase();
  console.log('🌱 Database seeded');
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});