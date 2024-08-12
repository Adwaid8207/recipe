import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const userResponse = await axios.get('http://localhost:3005/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(userResponse.data.admin);

        const recipeResponse = await axios.get('http://localhost:3005/viewAllRecipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(recipeResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response ? err.response.data.message : 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterRecipes = () => {
      let filtered = recipes;
      if (searchTerm) {
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.instructions.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(recipe => recipe.category === selectedCategory);
      }
      setFilteredRecipes(filtered);
    };

    filterRecipes();
  }, [searchTerm, selectedCategory, recipes]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:3005/deleteRecipe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
    } catch (err) {
      console.error('Error deleting recipe:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Failed to delete recipe.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ backgroundColor: '#1e1e1e', color: '#ffffff', minHeight: '100vh', padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>All Recipes</Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          }}
        />
        <FormControl fullWidth>
          <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
            sx={{ 
              '& .MuiSelect-select': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            }}
            MenuProps={{
              PaperProps: {
                sx: { bgcolor: '#2e2e2e', color: 'white' },
              }
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Appetizer">Appetizer</MenuItem>
            <MenuItem value="Main Course">Main Course</MenuItem>
            <MenuItem value="Dessert">Dessert</MenuItem>
            <MenuItem value="Beverage">Beverage</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card sx={{ backgroundColor: '#2e2e2e', color: '#ffffff' }}>
                {recipe.imageUrl && (
                  <CardMedia
                    component="img"
                    alt={recipe.title}
                    height="140"
                    image={recipe.imageUrl}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Typography variant="body2"><strong>Category:</strong> {recipe.category}</Typography>
                  <Typography variant="body2"><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</Typography>
                  <Typography variant="body2"><strong>Instructions:</strong> {recipe.instructions}</Typography>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(recipe._id)}
                      sx={{ mt: 2 }}
                    >
                      Delete
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No recipes found</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Home;
