const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./model/user');
const recipeModel = require('./model/recipe');
require('./connection');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user || !user.admin) return res.status(403).send({ message: 'Admin privileges required' });
    next();
  } catch (error) {
    console.error('Error checking admin status:', error.message);
    res.status(500).send({ message: 'Error checking admin status' });
  }
};

app.post('/signup', async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new userModel({ name, email, pass: hashedPassword });
    await newUser.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).send({ message: 'Error signing up' });
  }
});

app.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) return res.status(400).send({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email, admin: user.admin }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).send({ message: 'Error logging in' });
  }
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ name: user.name, email: user.email, admin: user.admin });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).send({ message: 'Error fetching profile' });
  }
});

app.put('/profile', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send({ message: 'User not found' });
    res.send({ name: updatedUser.name, email: updatedUser.email, admin: updatedUser.admin });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).send({ message: 'Error updating profile' });
  }
});

app.post('/addRecipe', authenticateToken, async (req, res) => {
  try {
    const newRecipe = new recipeModel({
      ...req.body,
      userId: req.user.id
    });
    await newRecipe.save();
    res.status(201).send({ message: 'Recipe added successfully', data: newRecipe });
  } catch (error) {
    console.error('Error adding recipe:', error.message);
    res.status(500).send({ message: 'Error adding recipe' });
  }
});

app.get('/viewRecipe', authenticateToken, async (req, res) => {
  try {
    const recipes = await recipeModel.find({ userId: req.user.id }).populate('userId', 'name');
    res.send(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).send({ message: 'Error fetching recipes' });
  }
});

app.put('/updateRecipe/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await recipeModel.findById(id);
    if (!recipe) return res.status(404).send({ message: 'Recipe not found' });
    if (recipe.userId.toString() !== req.user.id) return res.status(403).send({ message: 'Forbidden: You do not have permission to update this recipe' });

    const updatedRecipe = await recipeModel.findByIdAndUpdate(id, req.body, { new: true });
    res.send({ message: 'Recipe updated successfully', data: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    res.status(500).send({ message: 'Error updating recipe' });
  }
});

app.delete('/deleteRecipe/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await recipeModel.findById(id);
    if (!recipe) return res.status(404).send({ message: 'Recipe not found' });

    if (req.user.admin || recipe.userId.toString() === req.user.id) {
      await recipeModel.findByIdAndDelete(id);
      return res.send({ message: 'Recipe deleted successfully' });
    }

    res.status(403).send({ message: 'Forbidden: You do not have permission to delete this recipe' });
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    res.status(500).send({ message: 'Error deleting recipe' });
  }
});

app.get('/viewAllRecipes', async (req, res) => {
  try {
    const recipes = await recipeModel.find().populate('userId', 'name');
    res.send(recipes);
  } catch (error) {
    console.error('Error fetching all recipes:', error.message);
    res.status(500).send({ message: 'Error fetching all recipes' });
  }
});

app.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send({ message: 'Error fetching users' });
  }
});

app.delete('/deleteUser/:id', authenticateToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).send({ message: 'Error deleting user' });
  }
});

app.put('/updateUserAdmin/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  try {
    if (typeof admin !== 'boolean') return res.status(400).send({ message: 'Invalid admin value' });

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { admin },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send({ message: 'User not found' });
    res.send({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user admin status:', error.message);
    res.status(500).send({ message: 'Error updating user admin status' });
  }
});

app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
