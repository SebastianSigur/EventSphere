import {Routes, Route } from 'react-router-dom';
import useTitle from './hooks/useTitle.js';
import Layout from './components/Layout.js';
import Public from './components/Public.js';
function App() {

  useTitle('Event Sphere');

  return (
    <Routes>
      
       <Route index element={<Public />} />

    </Routes>
   
  );
}

export default App;
