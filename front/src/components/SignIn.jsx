import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Container, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setIsSignedIn }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3005/login', { email, pass });
      console.log('API Response:', response.data); 

      const { token, message } = response.data;

      
      localStorage.setItem('token', token);
      setIsSignedIn(true);

      
      if (response.data.admin) {
        navigate('/admin-dashboard'); 
      } else {
        navigate('/home'); 
      }
    } catch (error) {
      console.error('Sign-in error:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Sign-in failed!');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#ffffff',
        padding: 2
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Sign In</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: '100%' }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              input: { color: '#ffffff' }, 
              label: { color: '#ffffff' }, 
              fieldset: { borderColor: '#ffffff' } 
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            sx={{ 
              input: { color: '#ffffff' }, 
              label: { color: '#ffffff' }, 
              fieldset: { borderColor: '#ffffff' } 
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              mt: 2, 
              backgroundColor: '#1e1e1e', 
              color: '#ffffff',
              '&:hover': { backgroundColor: '#333333' } 
            }}
          >
            Sign In
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          )}
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SignIn;
