import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ isSignedIn }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
            RecipeApp
          </Typography>

          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button color="inherit" sx={{ textTransform: 'none', color: '#ffffff', marginLeft: 1 }}>
              Home
            </Button>
          </Link>

          {isSignedIn && (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ textTransform: 'none', color: '#ffffff', marginLeft: 1 }}>
                  Dashboard
                </Button>
              </Link>

              <Link to="/add-recipe" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ textTransform: 'none', color: '#ffffff', marginLeft: 1 }}>
                  Add Recipe
                </Button>
              </Link>

              <Link to="/view-recipes" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ textTransform: 'none', color: '#ffffff', marginLeft: 1 }}>
                  My Recipes
                </Button>
              </Link>

              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ textTransform: 'none', color: '#ffffff', marginLeft: 1 }}>
                  Profile
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
