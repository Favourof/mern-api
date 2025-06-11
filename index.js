const express = require('express');
       const app = express();
       app.get('/', (req, res) => res.json({ message: 'Hello from Express in WSL, Ezekiel!' }));
       app.listen(3001, () => console.log('Server running on port 3001'));
