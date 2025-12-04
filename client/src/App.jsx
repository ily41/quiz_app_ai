import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Admin from './components/Admin';
import Exam from './components/Exam';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Start Exam
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin (Manage Questions)
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Exam />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
