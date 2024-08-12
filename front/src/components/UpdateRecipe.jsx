import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, CardMedia } from '@mui/material';
import axios from 'axios';

const UpdateRecipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setInstructions(recipe.instructions);
      setIngredients(recipe.ingredients.join(', '));
      setImageUrl(recipe.imageUrl || '');
      setCategory(recipe.category || '');
    }
  }, [recipe]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); 

    if (!title || !instructions || !ingredients || !category) {
      setError('All fields are required');
      return;
    }

    try {
      const updatedRecipe = {
        title,
        instructions,
        ingredients: ingredients.split(',').map(ing => ing.trim()),
        imageUrl,
        category
      };

      await axios.put(`http://localhost:3005/updateRecipe/${recipe._id}`, updatedRecipe, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      alert('Recipe updated successfully!');
      navigate('/view-recipes');
    } catch (error) {
      console.error('Error updating recipe:', error.response?.data?.message || error.message);
      setError('Error updating recipe');
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
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Update Recipe</Typography>
        <Box
          component="form"
          onSubmit={handleUpdate}
          sx={{ mt: 3, width: '100%' }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            label="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
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
            label="Instructions"
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{
              input: { color: '#ffffff' },
              label: { color: '#ffffff' },
              fieldset: { borderColor: '#ffffff' },
              textarea: { color: '#ffffff' } 
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{
              input: { color: '#ffffff' },
              label: { color: '#ffffff' },
              fieldset: { borderColor: '#ffffff' }
            }}
          />
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              sx={{ 
                color: '#ffffff', 
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                '& .MuiSelect-icon': { color: '#ffffff' }
              }}
            >
              <MenuItem value="Appetizer">Appetizer</MenuItem>
              <MenuItem value="Main Course">Main Course</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
              <MenuItem value="Beverage">Beverage</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
            </Select>
          </FormControl>
          {imageUrl && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <CardMedia
                component="img"
                image={imageUrl}
                alt="Recipe Image"
                sx={{ width: '100%', height: 'auto' }}
              />
            </Box>
          )}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#1e1e1e', 
              color: '#ffffff',
              '&:hover': { backgroundColor: '#333333' }
            }}
          >
            Update Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateRecipe;
