const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/registro', require('./routes/registro'));

app.listen(process.env.PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${process.env.PORT}`);
});
