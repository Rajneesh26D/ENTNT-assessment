import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { worker } from './services/api';
import { seedDatabase } from './services/seed';

// Start MSW and seed database
async function enableMocking() {
  // In production, seed database WITHOUT MSW (MSW doesn't work in prod)
  if (import.meta.env.MODE !== 'development') {
    console.log('🌱 Production: Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!');
    return;
  }

  // In development, start MSW AND seed
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  console.log('🚀 MSW Started (Development)');
  
  await seedDatabase();
  console.log('🌱 Database seeded (Development)');
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
