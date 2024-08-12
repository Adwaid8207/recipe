const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adwaidmanoj:adwaid8207@cluster0.xqm5f4g.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0',
).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});
