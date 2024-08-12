import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const token = localStorage.getItem('token'); 

      await axios.post('http://localhost:3005/addRecipe', {
        title,
        ingredients: ingredients.split(',').map(item => item.trim()),
        instructions,
        imageUrl,
        category,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      alert('Recipe added successfully!');
      navigate('/view-recipes'); 
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Error adding recipe!');
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
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Add Recipe</Typography>
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
              '& .MuiInputBase-input': { color: '#ffffff' } 
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
            Add Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AddRecipe;
