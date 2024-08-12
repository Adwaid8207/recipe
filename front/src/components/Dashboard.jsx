import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [adminStatus, setAdminStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const profileResponse = await axios.get('http://localhost:3005/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(profileResponse.data);
        setFormData({ name: profileResponse.data.name, email: profileResponse.data.email });
        setAdminStatus(profileResponse.data.admin);

        // Fetch all users if admin
        if (profileResponse.data.admin) {
          const usersResponse = await axios.get('http://localhost:3005/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(usersResponse.data);
        } else {
          setUsers([profileResponse.data]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchData();
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
    setFormData({ name: user.name, email: user.email });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3005/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  const handleAdminChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3005/updateUserAdmin/${selectedUser._id}`, {
        admin: !selectedUser.admin
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => user._id === selectedUser._id ? { ...user, admin: !user.admin } : user));
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating admin status:', err);
      setError('Failed to update admin status.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container component="main" maxWidth="md" sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        {adminStatus ? 'Admin Dashboard' : 'My Profile'}
      </Typography>
      <Box sx={{ backgroundColor: '#ffffff', color: '#000000', padding: 3, borderRadius: 2 }}>
        {adminStatus ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>Manage Users</Typography>
            {users.length > 0 ? (
              users.map(user => (
                <Card key={user._id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2">Email: {user.email}</Typography>
                    <Typography variant="body2">Admin: {user.admin ? 'Yes' : 'No'}</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteUser(user._id)}
                      sx={{ mt: 2, mr: 2 }}
                    >
                      Delete User
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedUser(user)}
                      sx={{ mt: 2 }}
                    >
                      Change Admin Status
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No users found</Typography>
            )}

            {selectedUser && (
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Change Admin Status for {selectedUser.name}</Typography>
                <TextField
                  label="Admin Status"
                  value={selectedUser.admin ? 'Admin' : 'User'}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAdminChange}
                >
                  {selectedUser.admin ? 'Remove Admin' : 'Make Admin'}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box>
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
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
