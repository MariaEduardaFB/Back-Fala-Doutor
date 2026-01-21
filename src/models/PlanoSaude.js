const connection = require("../database/db");

class PlanoSaude {
  async findAll() {
    const result = await connection.query(
      'SELECT * FROM "PlanosSaude" ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await connection.query(
      'SELECT * FROM "PlanosSaude" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  //async findWithRelatedDataByPacienteId(paciente_id, id) {

  async findByNome(nome) {
    const result = await connection.query(
      'SELECT * FROM "PlanosSaude" WHERE nome = $1',
      [nome]
    );
    return result.rows[0] || null;
  }

  async create(nome, operadora, validade) {
    const result = await connection.query(
      'INSERT INTO "PlanosSaude" (nome, operadora, validade, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [nome, operadora, validade]
    );
    return result.rows[0];
  }

  async update(id, nome, operadora, validade) {
    const result = await connection.query(
      'UPDATE "PlanosSaude" SET nome = $1, operadora = $2, validade = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [nome, operadora, validade, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await connection.query(
      'DELETE FROM "PlanosSaude" WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new PlanoSaude();
