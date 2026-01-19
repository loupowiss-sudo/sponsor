const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Sponsoring Manager PRO (12).html'));
});

app.get('/ping', (req, res) => {
  res.json({ ok: true });
});

app.get('/data', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), 'utf8');
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = raw ? JSON.parse(raw) : {};
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'read_error' });
  }
});

app.post('/data', (req, res) => {
  try {
    const payload = req.body || {};
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'write_error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on http://0.0.0.0:${port}`);
});
