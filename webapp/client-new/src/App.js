import './App.css';
import {Navbar,Footer} from './components'
import { Home, Profile, Item, Create, Register, Connect } from './pages'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path=":item/:id" element={<Item />} />
            <Route path="/create" element={<Create /> } />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={ <Connect />} />
            <Route path="/register" element={ <Register />} />
            <Route path="/connect" element={ <Register /> } />
          </Routes>
      <Footer />
    </div>
  );
}

export default App;
