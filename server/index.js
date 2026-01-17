require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE MULTER (SUBIDA DE ARCHIVOS) ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Servir la carpeta uploads como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a Base de Datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- INICIALIZACIÓN DE DB ---
const initDB = async () => {
  try {
    // 1. Usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'pending'
      );
    `);
    
    // 2. Admin por defecto
    await pool.query(`
      INSERT INTO users (username, password, role) 
      VALUES ('profe', 'profe123', 'admin') 
      ON CONFLICT (username) DO UPDATE SET role = 'admin';
    `);

    // 3. Grupos y Estudiantes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        horario TEXT,
        profesor TEXT
      );
    `);
    
    // Migración segura columna profesor
    try { await pool.query("ALTER TABLE groups ADD COLUMN IF NOT EXISTS profesor TEXT"); } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        nombre_completo TEXT NOT NULL,
        edad INTEGER,
        grupo_id INTEGER REFERENCES groups(id),
        foto_perfil TEXT
      );
    `);

    // 4. Profesores por Grupo
    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_teachers (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(group_id, user_id)
      );
    `);

    // 5. Schedules
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        title TEXT,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Asistencia
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Galería
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        file_url TEXT,
        file_type TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. ANUNCIOS (Nuevo)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ DB Actualizada: Tablas listas.");
  } catch (err) {
    console.error("Error DB:", err);
  }
};
initDB();

// --- CRON JOBS ---
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("🧹 Limpieza asistencia > 30 días...");
    await pool.query("DELETE FROM attendance WHERE date < NOW() - INTERVAL '30 days'");
  } catch (e) { console.error(e); }
});

cron.schedule('0 0 * * *', async () => {
  try {
    console.log("🧹 Limpieza galería > 7 días...");
    const oldActivities = await pool.query("SELECT * FROM activities WHERE created_at < NOW() - INTERVAL '7 days'");
    for (const activity of oldActivities.rows) {
        const filename = path.basename(activity.file_url);
        const filePath = path.join(__dirname, 'uploads', filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await pool.query("DELETE FROM activities WHERE created_at < NOW() - INTERVAL '7 days'");
  } catch (e) { console.error(e); }
});

// ==========================================
//          RUTAS DE LA API (BACKEND)
// ==========================================

// --- AUTENTICACIÓN ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });
        const user = result.rows[0];
        if (user.password === password) {
            res.json({ message: "Éxito", user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ error: "Contraseña incorrecta" });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("INSERT INTO users (username, password, role) VALUES ($1, $2, 'pending') RETURNING id, username, role", [username, password]);
        res.json({ message: "Usuario creado", user: result.rows[0] });
    } catch (e) { res.status(500).json({ error: "Error registro" }); }
});

app.post('/api/users/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE users SET role = 'teacher' WHERE id = $1", [id]);
        res.json({ message: "Aprobado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users/pending', async (req, res) => {
    try { const result = await pool.query("SELECT * FROM users WHERE role = 'pending'"); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users/teachers', async (req, res) => {
    try { const result = await pool.query("SELECT id, username FROM users WHERE role = 'teacher'"); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const check = await pool.query('SELECT username, role FROM users WHERE id = $1', [id]);
        if (check.rows.length > 0) {
            const user = check.rows[0];
            if (user.username === 'profe' || user.role === 'admin') return res.status(403).json({ error: "⛔ No puedes eliminar al Admin." });
        }
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- GRUPOS ---
app.get('/api/groups', async (req, res) => { try { const result = await pool.query('SELECT * FROM groups ORDER BY id ASC'); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/groups', async (req, res) => { try { const result = await pool.query('INSERT INTO groups (nombre, horario, profesor) VALUES ($1, $2, $3) RETURNING *', [req.body.nombre, req.body.horario, req.body.profesor]); res.json(result.rows[0]); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete('/api/groups/:id', async (req, res) => { try { await pool.query('DELETE FROM groups WHERE id = $1', [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- ASIGNACIÓN PROFESORES ---
app.get('/api/groups/:id/teachers', async (req, res) => { try { const result = await pool.query(`SELECT u.id, u.username FROM group_teachers gt JOIN users u ON gt.user_id = u.id WHERE gt.group_id = $1`, [req.params.id]); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/groups/:id/teachers', async (req, res) => { try { await pool.query('INSERT INTO group_teachers (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.params.id, req.body.userId]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete('/api/groups/:id/teachers/:userId', async (req, res) => { try { await pool.query('DELETE FROM group_teachers WHERE group_id = $1 AND user_id = $2', [req.params.id, req.params.userId]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- SCHEDULES (ROLES) ---
app.post('/api/schedules', upload.single('file'), async (req, res) => { try { const { title } = req.body; const fileUrl = `/uploads/${req.file.filename}`; const result = await pool.query('INSERT INTO schedules (title, file_url) VALUES ($1, $2) RETURNING *', [title, fileUrl]); res.json(result.rows[0]); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/schedules', async (req, res) => { try { const result = await pool.query('SELECT * FROM schedules ORDER BY created_at DESC'); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete('/api/schedules/:id', async (req, res) => { try { const { id } = req.params; const result = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING file_url', [id]); if (result.rows.length > 0) { const fp = path.join(__dirname, 'uploads', path.basename(result.rows[0].file_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp); } res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- GALERÍA ---
app.post('/api/activities', upload.single('file'), async (req, res) => { try { if (!req.file) throw new Error("Sin archivo"); const { description } = req.body; const fileUrl = `/uploads/${req.file.filename}`; const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image'; const result = await pool.query('INSERT INTO activities (file_url, file_type, description) VALUES ($1, $2, $3) RETURNING *', [fileUrl, fileType, description]); res.json(result.rows[0]); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/activities', async (req, res) => { try { const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC'); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete('/api/activities/:id', async (req, res) => { try { const { id } = req.params; const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING file_url', [id]); if (result.rows.length > 0) { const fp = path.join(__dirname, 'uploads', path.basename(result.rows[0].file_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp); } res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- ASISTENCIA ---
app.post('/api/attendance', async (req, res) => { const { groupId, records } = req.body; const client = await pool.connect(); try { await client.query('BEGIN'); const date = new Date().toISOString().split('T')[0]; for (const record of records) { await client.query('INSERT INTO attendance (student_id, group_id, date, status) VALUES ($1, $2, $3, $4)', [record.studentId, groupId, date, record.status]); } await client.query('COMMIT'); res.json({ success: true }); } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); } finally { client.release(); } });
app.get('/api/attendance/history', async (req, res) => { try { const result = await pool.query(`SELECT a.id, a.date, a.status, s.nombre_completo as student_name, g.nombre as group_name FROM attendance a JOIN students s ON a.student_id = s.id JOIN groups g ON a.group_id = g.id ORDER BY a.date DESC, g.nombre ASC`); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- ESTUDIANTES ---
app.get('/api/students', async (req, res) => { try { const result = await pool.query('SELECT * FROM students'); res.json(result.rows); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/students', async (req, res) => { try { const result = await pool.query('INSERT INTO students (nombre_completo, edad, grupo_id, foto_perfil) VALUES ($1, $2, $3, $4) RETURNING *', [req.body.nombre_completo, req.body.edad, req.body.grupo_id, req.body.foto_perfil]); res.json(result.rows[0]); } catch (e) { res.status(500).json({ error: e.message }); } });
app.delete('/api/students/:id', async (req, res) => { try { await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]); res.json({ success: true }); } catch (e) { res.status(500).json({ error: e.message }); } });

// --- RUTAS DE ANUNCIOS (MEGÁFONO) ---
// 🚨 AQUÍ ES EL LUGAR CORRECTO (Antes del Catch-All) 🚨
app.get('/api/announcement', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM announcements ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || null); 
  } catch (err) { res.status(500).send('Error'); }
});

app.post('/api/announcement', async (req, res) => {
  const { title, message } = req.body;
  try {
    await pool.query('DELETE FROM announcements'); // Borra anteriores
    const result = await pool.query('INSERT INTO announcements (title, message) VALUES ($1, $2) RETURNING *', [title, message]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).send('Error'); }
});

app.delete('/api/announcement', async (req, res) => {
  try { await pool.query('DELETE FROM announcements'); res.json({ message: 'Eliminado' }); } catch (err) { res.status(500).send('Error'); }
});

// ==========================================
//          SERVIR FRONTEND (REACT)
// ==========================================

// CRÍTICO: Esto va AL FINAL de todas las rutas de API
app.use(express.static(path.join(__dirname, '../client/dist')));

// CATCH-ALL: La última línea de defensa
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor LISTO en puerto ${port}`);
});