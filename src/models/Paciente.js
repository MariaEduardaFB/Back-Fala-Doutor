const connection = require("../database/db");

class Paciente {
  async findAll() {
    const result = await connection.query(
      'SELECT * FROM "Pacientes" ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await connection.query(
      'SELECT * FROM "Pacientes" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
  async findWithPlanoDeSaude(paciente_id) {
    const result = await connection.query(
      `SELECT pa.*, ps.id AS plano_id, ps.nome AS plano_nome, ps.operadora AS plano_operadora, ps.validade AS plano_validade
       FROM "Pacientes" pa
       LEFT JOIN "PlanosSaude" ps ON pa.plano_id = ps.id
       WHERE pa.id = $1`,
      [paciente_id]
    );
    return result.rows[0] || null;
  }

  async findByCpf(cpf) {
    const result = await connection.query(
      'SELECT * FROM "Pacientes" WHERE cpf = $1',
      [cpf]
    );
    return result.rows[0] || null;
  }

  async create(nome, cpf, telefone, plano_id) {
    const result = await connection.query(
      'INSERT INTO "Pacientes" (nome, cpf, telefone, plano_id, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [nome, cpf, telefone, plano_id || null]
    );
    return result.rows[0];
  }

  async update(id, nome, cpf, telefone, plano_id) {
    const result = await connection.query(
      'UPDATE "Pacientes" SET nome = $1, cpf = $2, telefone = $3, plano_id = $4, "updatedAt" = NOW() WHERE id = $5 RETURNING *',
      [nome, cpf, telefone, plano_id || null, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await connection.query(
      'DELETE FROM "Pacientes" WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new Paciente();
