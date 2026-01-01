import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    edad: '',
    grupo_id: '',
    foto_perfil: ''
  });
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Cargar los grupos disponibles para el selector
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error cargando grupos", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Alumno agregado correctamente');
        navigate('/dashboard');
      } else {
        alert('Error al agregar alumno');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFEBEE 0%, #E0F2F1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div style={{ maxWidth: '500px', width: '90%', padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#555' }}>📝 Registrar Nuevo Alumno</h2>
        <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
          <label>Nombre Completo:</label>
          <input type="text" name="nombre_completo" required onChange={handleChange} placeholder="Ej: Juan Pérez" />
          
          <label>Edad:</label>
          <input type="number" name="edad" required onChange={handleChange} placeholder="Ej: 4" />
          
          <label>ID del Grupo:</label>
          <select name="grupo_id" onChange={handleChange} required defaultValue="">
            <option value="" disabled>-- Selecciona un grupo --</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.nombre}</option>
            ))}
          </select>
          
          <label>URL Foto de Perfil:</label>
          <input type="text" name="foto_perfil" onChange={handleChange} placeholder="https://ejemplo.com/foto.jpg" />
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4ECDC4', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>Guardar</button>
            <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: '#FF6B6B', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;