import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Components/Login';
import Home from './Components/Home';

function App() {
  const [login, setLogin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jwtToken = localStorage.getItem('admintoken');
  const url = 'https://oneapp.trivedagroup.com';

  const handleLogin = () => {
    setLogin(!login);
  };

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`${url}/api/c3/user/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const role = response.data.ser.role;
      setUserRole(role);
      if (role !== 'admin') {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchUserRole();
    }
  }, [jwtToken]);

  const PrivateRoute = ({ element, ...rest }) => {
    return userRole === 'admin' ? element : <Navigate to="/" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={<PrivateRoute element={<Home />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
