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
// Aseguramos que la carpeta 'uploads' exista
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
    limits: { fileSize: 50 * 1024 * 1024 } // Límite de 50MB para videos
});

// Servir la carpeta uploads como pública para ver las imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a Base de Datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- INICIALIZACIÓN DE DB (CON ROLES) ---
const initDB = async () => {
  try {
    // 1. Tabla de Usuarios (Ahora con ROL)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'pending' -- 'admin', 'teacher', 'pending'
      );
    `);
    
    // 2. Insertar al ADMIN (Tú)
    await pool.query(`
      INSERT INTO users (username, password, role) 
      VALUES ('profe', 'profe123', 'admin') 
      ON CONFLICT (username) DO UPDATE SET role = 'admin';
    `);

    // 3. Tablas de Grupos y Estudiantes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        horario TEXT,
        profesor TEXT
      );
    `);

    // Migración segura: Agregar columna profesor si no existe (para DBs ya creadas)
    try {
      await pool.query("ALTER TABLE groups ADD COLUMN IF NOT EXISTS profesor TEXT");
    } catch (e) { console.log("Info DB:", e.message); }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        nombre_completo TEXT NOT NULL,
        edad INTEGER,
        grupo_id INTEGER REFERENCES groups(id),
        foto_perfil TEXT
      );
    `);

    // 4. Tabla Intermedia: Profesores por Grupo
    await pool.query(`
      CREATE TABLE IF NOT EXISTS group_teachers (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(group_id, user_id)
      );
    `);

    // 5. Tabla de Roles/Calendarios (Schedules)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        title TEXT,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tabla de Asistencia (Attendance)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        status TEXT, -- 'present', 'absent'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Tabla de Galería de Actividades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        file_url TEXT,
        file_type TEXT, -- 'image' o 'video'
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ DB Actualizada: Sistema de Roles activo.");
  } catch (err) {
    console.error("Error DB:", err);
  }
};
initDB();

// --- TAREA PROGRAMADA (CRON JOB) ---
// Se ejecuta todos los días a las 00:00 horas
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("🧹 Ejecutando limpieza automática de asistencia antigua...");
    // Elimina registros con más de 30 días de antigüedad
    await pool.query("DELETE FROM attendance WHERE date < NOW() - INTERVAL '30 days'");
    console.log("✅ Limpieza completada.");
  } catch (e) { console.error("Error en cron:", e); }
});

// --- TAREA PROGRAMADA: LIMPIEZA DE GALERÍA (SEMANAL) ---
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("🧹 Buscando actividades antiguas para eliminar...");
    // 1. Buscar archivos con más de 7 días
    const oldActivities = await pool.query("SELECT * FROM activities WHERE created_at < NOW() - INTERVAL '7 days'");
    
    // 2. Borrar archivos físicos
    for (const activity of oldActivities.rows) {
        const filename = path.basename(activity.file_url);
        const filePath = path.join(__dirname, 'uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Borrado físico
            console.log(`🗑️ Archivo borrado: ${filename}`);
        }
    }
    // 3. Borrar registros de la DB
    await pool.query("DELETE FROM activities WHERE created_at < NOW() - INTERVAL '7 days'");
  } catch (e) { console.error("Error en cron galería:", e); }
});

// --- RUTAS DE AUTENTICACIÓN ---

// 1. LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`📨 Login: ${username}`);

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = result.rows[0];
        if (user.password === password) {
            res.json({ 
                message: "Éxito", 
                user: { id: user.id, username: user.username, role: user.role } 
            });
        } else {
            res.status(401).json({ error: "Contraseña incorrecta" });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. REGISTRO
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(`📝 Nuevo registro solicitado: ${username}`);
    
    try {
        const result = await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, 'pending') RETURNING id, username, role",
            [username, password]
        );
        res.json({ message: "Usuario creado. Espera aprobación.", user: result.rows[0] });
    } catch (e) {
        console.error("Error registro:", e);
        res.status(500).json({ error: "Error al registrar (¿Usuario duplicado?)" });
    }
});

// 3. APROBAR USUARIOS
app.post('/api/users/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE users SET role = 'teacher' WHERE id = $1", [id]);
        res.json({ message: "Usuario aprobado ahora es Teacher" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. LISTA DE USUARIOS PENDIENTES
app.get('/api/users/pending', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE role = 'pending'");
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. LISTA DE TODOS LOS TEACHERS (Para el select de asignar)
app.get('/api/users/teachers', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username FROM users WHERE role = 'teacher'");
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 6. ELIMINAR USUARIO (Admin)
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Seguridad: Verificar que no sea el admin principal
        const check = await pool.query('SELECT username, role FROM users WHERE id = $1', [id]);
        if (check.rows.length > 0) {
            const user = check.rows[0];
            if (user.username === 'profe' || user.role === 'admin') {
                return res.status(403).json({ error: "⛔ No puedes eliminar al Administrador principal." });
            }
        }

        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- RUTAS DE DATOS ---

app.get('/api/groups', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM groups ORDER BY id ASC'); res.json(result.rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/groups', async (req, res) => {
  try { 
    const result = await pool.query(
      'INSERT INTO groups (nombre, horario, profesor) VALUES ($1, $2, $3) RETURNING *', 
      [req.body.nombre, req.body.horario, req.body.profesor]
    ); 
    res.json(result.rows[0]); 
  } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM groups WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: "Grupo eliminado" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- RUTAS DE ASIGNACIÓN DE PROFESORES ---

// Obtener profesores de un grupo
app.get('/api/groups/:id/teachers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username 
            FROM group_teachers gt
            JOIN users u ON gt.user_id = u.id
            WHERE gt.group_id = $1
        `, [req.params.id]);
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Asignar profesor a grupo
app.post('/api/groups/:id/teachers', async (req, res) => {
    try {
        await pool.query('INSERT INTO group_teachers (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.params.id, req.body.userId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Eliminar profesor de grupo
app.delete('/api/groups/:id/teachers/:userId', async (req, res) => {
    try {
        await pool.query('DELETE FROM group_teachers WHERE group_id = $1 AND user_id = $2', [req.params.id, req.params.userId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- RUTAS DE ROLES MENSUALES (SCHEDULES) ---

app.post('/api/schedules', upload.single('file'), async (req, res) => {
    try {
        const { title } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`; // Ruta relativa para el frontend
        const result = await pool.query(
            'INSERT INTO schedules (title, file_url) VALUES ($1, $2) RETURNING *',
            [title, fileUrl]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/schedules', async (req, res) => {
    try { const result = await pool.query('SELECT * FROM schedules ORDER BY created_at DESC'); res.json(result.rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// --- RUTAS DE GALERÍA DE ACTIVIDADES ---

app.post('/api/activities', upload.single('file'), async (req, res) => {
    try {
        const { description } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        
        const result = await pool.query(
            'INSERT INTO activities (file_url, file_type, description) VALUES ($1, $2, $3) RETURNING *',
            [fileUrl, fileType, description]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/activities', async (req, res) => {
    try { const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC'); res.json(result.rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING file_url', [id]);
        
        if (result.rows.length > 0) {
            const filename = path.basename(result.rows[0].file_url);
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- RUTAS DE ASISTENCIA ---

app.post('/api/attendance', async (req, res) => {
    const { groupId, records } = req.body; // records es un array: [{ studentId, status }]
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        for (const record of records) {
            await client.query(
                'INSERT INTO attendance (student_id, group_id, date, status) VALUES ($1, $2, $3, $4)',
                [record.studentId, groupId, date, record.status]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Asistencia guardada" });
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: e.message });
    } finally {
        client.release();
    }
});

app.get('/api/attendance/history', async (req, res) => {
    try {
        // Consulta con JOINs para traer nombres de alumnos y grupos
        const result = await pool.query(`
            SELECT a.id, a.date, a.status, s.nombre_completo as student_name, g.nombre as group_name
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN groups g ON a.group_id = g.id
            ORDER BY a.date DESC, g.nombre ASC
        `);
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/students', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM students'); res.json(result.rows); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/students', async (req, res) => {
  try { const result = await pool.query('INSERT INTO students (nombre_completo, edad, grupo_id, foto_perfil) VALUES ($1, $2, $3, $4) RETURNING *', [req.body.nombre_completo, req.body.edad, req.body.grupo_id, req.body.foto_perfil]); res.json(result.rows[0]); } 
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: "Alumno eliminado" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Servir archivos de React
app.use(express.static(path.join(__dirname, '../client/dist')));

// Manejo de rutas para SPA (Single Page Application)
app.get(/.*/, (req, res) => {    
    // Agregamos headers para prevenir el caché del index.html
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Servidor LISTO en puerto ${port}`);
});