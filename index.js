const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
const Item = mongoose.model('Item', new mongoose.Schema({ name: String }));
app.get('/', (req, res) => res.json({ message: 'Hello from Express in WSL, Ezekiel!' }));
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});
app.post('/items', async (req, res) => {
  const item = new Item({ name: req.body.name || 'Test Item' });
  await item.save();
  res.json(item);
});
app.listen(3001, () => console.log('Server running on port 3001'));