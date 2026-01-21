const app = require("./app")
const connection = require('./database/db');

// Teste de conexão ao iniciar
async function testDatabaseConnection() {
  try {
    const res = await connection.query('SELECT NOW()');
    console.log('✅ Conectado ao banco de dados!');
    console.log('Hora do servidor:', res.rows[0].now);
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    console.error('Verifique suas credenciais no .env');
  }
}

testDatabaseConnection();

app.listen(3000, () => console.log("🚀 Server is running on port 3000"))