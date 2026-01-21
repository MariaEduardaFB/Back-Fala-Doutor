const connection = require("../database/db");

class Medico {
  async findAll() {
    const result = await connection.query(
      'SELECT * FROM "Medicos" ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await connection.query(
      'SELECT * FROM "Medicos" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByCrm(crm) {
    const result = await connection.query(
      'SELECT * FROM "Medicos" WHERE crm = $1',
      [crm]
    );
    return result.rows[0] || null;
  }

  async create(nome, crm, telefone) {
    const result = await connection.query(
      'INSERT INTO "Medicos" (nome, crm, telefone, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [nome, crm, telefone]
    );
    return result.rows[0];
  }

  async update(id, nome, crm, telefone) {
    const result = await connection.query(
      'UPDATE "Medicos" SET nome = $1, crm = $2, telefone = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [nome, crm, telefone, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await connection.query(
      'DELETE FROM "Medicos" WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new Medico();
