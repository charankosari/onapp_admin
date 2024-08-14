import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('admintoken');
      if (token) {
        try {
          const response = await axios.get('https://oneapp.trivedagroup.com/api/c3/user/me', { 
            headers: { Authorization: `Bearer ${token}` }
          });
          const user=response.data.user;

          if (user.role === 'admin') {
            navigate('/home');
          } else {
            localStorage.removeItem('admintoken');
            setError('Insufficient privileges.');
          }
        } catch (error) {
          localStorage.removeItem('admintoken');
          setError('Invalid token or error occurred.');
        }
      }
    };

    verifyAdmin();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://oneapp.trivedagroup.com/api/c3/user/login', { name, password }); // Replace with your login endpoint
      const user=response.data.user;
      const token=response.data.jwtToken;
      localStorage.setItem('admintoken', token);

      if (user.role === 'admin') {
        navigate('/home');
      } else {
        setError('Insufficient privileges.');
      }
    } catch (error) {
      setError('Invalid credentials or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'90vh'}}>
    
    
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
    </div>

  );
};

export default LoginPage;
