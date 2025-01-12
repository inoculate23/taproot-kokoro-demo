const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve the "static" directory for other static files
app.use('/', express.static(__dirname));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen for requests
app.listen(port, () => {
    console.log(`Development server running at http://localhost:${port}`);
});
