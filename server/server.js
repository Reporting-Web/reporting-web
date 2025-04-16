const express = require('express');
const path = require('path');
const app = express();
const port = 5090; // Or your chosen port

const distPath = path.join(__dirname, '..', 'ReportingWeb', 'dist', 'reporting-web', 'browser');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});