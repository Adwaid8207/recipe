import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios.get('http://localhost:3005/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3005/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data); 
      setIsEditing(false); 
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error connecting to server');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/signin');
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
        padding: 2,
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Profile</Typography>
        <Box
          component="form"
          sx={{
            mt: 3,
            width: '100%',
            backgroundColor: 'transparent',
            padding: 3,
            borderRadius: 2,
          }}
        >
          {isEditing ? (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                sx={{
                  input: { color: '#ffffff' },
                  label: { color: '#ffffff' },
                  fieldset: { borderColor: '#ffffff' },
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  input: { color: '#ffffff' },
                  label: { color: '#ffffff' },
                  fieldset: { borderColor: '#ffffff' },
                }}
              />
              <Button
                onClick={handleSave}
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  backgroundColor: '#1e1e1e',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#333333' },
                }}
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6">Name: {user.name}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>
              <Button
                onClick={() => setIsEditing(true)}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </>
          )}
          <Button
            onClick={handleLogout}
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
