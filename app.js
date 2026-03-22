const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database('clientes.db');

// Crear tabla
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    saldo REAL DEFAULT 0
  )
`);

// Insertar datos iniciales si tabla vacía
const count = db.prepare('SELECT COUNT(*) as cnt FROM clientes').get().cnt;
if (count === 0) {
  db.exec(`
    INSERT INTO clientes (nombre, email, telefono, saldo) VALUES
    ('Juan Pérez', 'juan@email.com', '123456789', 1500.50),
    ('María Gómez', 'maria@email.com', '987654321', 2500.00),
    ('Carlos López', 'carlos@email.com', '555666777', 800.75)
  `);
}

// GET todos los clientes
app.get('/clientes', (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes').all();
  res.json(clientes);
});

// GET cliente por ID
app.get('/clientes/:id', (req, res) => {
  const id = req.params.id;
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
