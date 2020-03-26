const path = require('path'),
   express = require('express'),
   app = express(),
   port = process.env.PORT || 3000,
   cors = require('cors');

app.listen(port, () => { console.log(`App is listening on port ${port}`) });app.get('/', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use(cors());

app.use(express.static(path.resolve(__dirname)));