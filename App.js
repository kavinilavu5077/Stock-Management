
import './App.css';
import Leftbar from './components/leftbar/Leftbar';
import Navbar from "./components/navbar/Navbar";
// import Add from "./pages/add";
import Main from "./pages/mainequipment";
import Llf from './pages/llf';
import SparesSearch from './pages/sparessearch';
import Healthstatus from './pages/healthstatus';
import Allequipment from './pages/allequipment';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



function App() {

  
  return (
    
     
    <Router>
      <div className="App">
      <Navbar />
      <div className="main-wrapper">
        <Leftbar />
        <div className="app-content" >
          <Routes>
         
          <Route path="/llf" element={<Llf />} />
          <Route path="/newequipment" element={<Main />} />
          <Route path="/viewspares" element={<SparesSearch />} />
          <Route path="/healthstatus" element={<Healthstatus />} />
          <Route path="/allequipments" element={<Allequipment/>} />
          
          </Routes>
        </div>
        </div>
      </div>
    </Router>
    );
    }
  

export default App;
