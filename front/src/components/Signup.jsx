import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Container, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    pass: '',
  });

  const navigate = useNavigate();

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, pass } = data;

    if (!name || !email || !pass) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:3005/signup', { name, email, pass });
      alert('Signup successful!');
      navigate('/signin');
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
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
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Sign Up</Typography>
        <Box
          component="form"
          onSubmit={submitHandler}
          sx={{
            mt: 3,
            width: '100%',
            backgroundColor: 'transparent', 
            padding: 3,
            borderRadius: 2
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={data.name}
            onChange={inputHandler}
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={data.email}
            onChange={inputHandler}
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
            name="pass"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={data.pass}
            onChange={inputHandler}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
