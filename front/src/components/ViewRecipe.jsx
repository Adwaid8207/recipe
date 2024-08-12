import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, FormControl, InputLabel, Typography, Box, Grid, Card, CardContent, CardMedia, Collapse, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    try {
      const response = await axios.get('http://localhost:3005/viewRecipe', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { userId }, // Pass user ID as query parameter
      });
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/deleteRecipe/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const updatedRecipes = recipes.filter(recipe => recipe._id !== id);
      setRecipes(updatedRecipes);
      setFilteredRecipes(updatedRecipes);
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe!');
    }
  };

  const handleUpdate = (recipe) => {
    navigate(`/updateRecipe/${recipe._id}`, { state: { recipe } });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    filterRecipes(selectedCategory, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterRecipes(category, query);
  };

  const filterRecipes = (category, query) => {
    let filtered = recipes;
    if (category) {
      filtered = filtered.filter(recipe => recipe.category === category);
    }
    if (query) {
      filtered = filtered.filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()));
    }
    setFilteredRecipes(filtered);
  };

  const handleExpandClick = (id) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  return (
    <Box sx={{ backgroundColor: '#1e1e1e', color: '#ffffff', minHeight: '100vh', padding: 2 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
        <Select
          value={category}
          onChange={handleCategoryChange}
          label="Filter by Category"
          sx={{ backgroundColor: '#2e2e2e', color: '#ffffff' }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Appetizer">Appetizer</MenuItem>
          <MenuItem value="Main Course">Main Course</MenuItem>
          <MenuItem value="Dessert">Dessert</MenuItem>
          <MenuItem value="Beverage">Beverage</MenuItem>
          <MenuItem value="Snack">Snack</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3, backgroundColor: '#2e2e2e' }}
        InputLabelProps={{
          sx: { color: '#ffffff' }
        }}
        InputProps={{
          sx: { color: '#ffffff' },
          endAdornment: <Typography sx={{ color: '#ffffff' }}>🔍</Typography>
        }}
      />
      <Grid container spacing={2}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card sx={{ backgroundColor: '#2e2e2e', color: '#ffffff' }}>
                {recipe.imageUrl && (
                  <CardMedia
                    component="img"
                    alt={recipe.title}
                    height="140"
                    image={recipe.imageUrl}
                    onClick={() => handleExpandClick(recipe._id)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Button
                    onClick={() => handleUpdate(recipe)}
                    sx={{ mt: 2, mr: 1, backgroundColor: '#1976d2', color: '#ffffff', '&:hover': { backgroundColor: '#1565c0' } }} 
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDelete(recipe._id)}
                    sx={{ mt: 2, backgroundColor: '#d32f2f', color: '#ffffff', '&:hover': { backgroundColor: '#c62828' } }} 
                  >
                    Delete
                  </Button>
                </CardContent>
                <Collapse in={expandedRecipe === recipe._id}>
                  <CardContent>
                    <Typography variant="body2">{recipe.ingredients}</Typography>
                    <Typography variant="body2">{recipe.instructions}</Typography>
                  </CardContent>
                </Collapse>
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

export default ViewRecipe;
