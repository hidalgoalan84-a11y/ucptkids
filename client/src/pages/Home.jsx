function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎈 Bienvenidos a UCPT Kids 🎈</h1>
      <p style={{ fontSize: '1.2rem' }}>El lugar más divertido para aprender.</p>
      
      <img 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnJ4Z3J4Z3J4Z3J4Z3J4Z3J4Z3J4Z3J4Z3J4Z3J4Z3J4/xT4uQulXaV5r75VHeo/giphy.gif" 
        alt="Niños felices" 
        style={{ borderRadius: '15px', margin: '20px', maxWidth: '300px' }}
      />

      <div style={{ marginTop: '30px' }}>
        <a href="/admin" style={{ 
          background: '#007bff', 
          color: 'white', 
          padding: '10px 20px', 
          textDecoration: 'none', 
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          Soy Profesor (Entrar) 🔐
        </a>
      </div>
    </div>
  )
}

export default Home