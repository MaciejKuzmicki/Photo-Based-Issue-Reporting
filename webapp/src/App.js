import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";



function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/mainpage" element={<MainPage/>}  />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
