require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const crearTablas = async () => {
  try {
    console.log("🏗️  Iniciando construcción de tablas...");

    // 1. Tabla de Usuarios (Profesores y Admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        rol VARCHAR(20) DEFAULT 'profe'
      );
    `);
    console.log("✅ Tabla 'users' creada.");

    // 2. Tabla de Grupos (Salones)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL, -- Ej: Maternal A
        horario VARCHAR(100)
      );
    `);
    console.log("✅ Tabla 'groups' creada.");

    // 3. Tabla de Alumnos (Conectada a Grupos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(150) NOT NULL,
        edad INT,
        grupo_id INT REFERENCES groups(id), -- Esto vincula al alumno con un salón
        foto_perfil TEXT -- Aquí guardaremos el link de la foto
      );
    `);
    console.log("✅ Tabla 'students' creada.");

    // 4. Tabla de Actividades (Galería de fotos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100),
        descripcion TEXT,
        foto_url TEXT, -- Link de la foto de la actividad
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabla 'activities' creada.");

    console.log("🎉 ¡Todo listo! La base de datos ya tiene estructura.");
    pool.end();
  } catch (error) {
    console.error("❌ Error creando las tablas:", error);
    pool.end();
  }
};

crearTablas();