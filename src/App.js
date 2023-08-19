
import {Routes, Route } from 'react-router-dom';
import useTitle from './hooks/useTitle.js';
import Layout from './components/Layout.js';
import Public from './components/Public.js';
import UserHome from './features/users/userHome.js';
import PersistLogin from './features/auth/PersistLogin.js';
import EventCreationForm from './features/events/EventCreationForm.js';
import People from './features/users/People.js';
function App() {

  useTitle('Event Sphere');

  return (
    <Routes>
        <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route index element={<Public />} >

          </Route>
          <Route path="/users">
            <Route path=":id" element={<UserHome />} >
              
            </Route>

        </Route>
          <Route path="/create-event/:id" element={<EventCreationForm />} />
          <Route path="/friends/:id" element={<People />} />


        </Route>
      </Route>
    </Routes>
   
  );
}

export default App;
