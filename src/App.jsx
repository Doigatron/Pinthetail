import React from 'react';
import './App.css';

function App() {
  return (
    <div>
      <header style={{ backgroundColor: '#f4694c', padding: '2rem', color: 'white' }}>
        <h1>Pin the Tail</h1>
        <p>A community-powered pet sighting map to reunite lost animals with their loved ones.</p>
      </header>

      <main style={{ padding: '2rem' }}>
        <section>
          <h2>How It Works</h2>
          <p>Users pin accurate locations of found or spotted pets on a shared map. Filter by animal type, color, or city to streamline your search. Add photos, notes, or videos. It’s that simple—and powerful.</p>
        </section>

        <section>
          <h2>Join the Movement</h2>
          <p>If you’ve lost a pet or want to help others in your community find theirs, join our early access list:</p>
          <a href="https://forms.gle/your-real-form-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#f4694c', color: 'white', padding: '1rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Join the Waitlist</a>
        </section>
      </main>

      <footer style={{ backgroundColor: '#eee', textAlign: 'center', padding: '1rem', fontSize: '0.9rem' }}>
        &copy; 2025 Pin the Tail. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
