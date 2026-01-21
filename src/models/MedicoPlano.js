const connection = require("../database/db");

class MedicoPlano {
  async create(medico_id, plano_id) {
    const result = await connection.query(
      'INSERT INTO "MedicoPlanos" (medico_id, plano_id, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [medico_id, plano_id]
    );
    return result.rows[0];
  }

  async findByMedicoId(medico_id) {
    const result = await connection.query(
      'SELECT p.*, mp.medico_id FROM "PlanosSaude" p INNER JOIN "MedicoPlanos" mp ON p.id = mp.plano_id WHERE mp.medico_id = $1',
      [medico_id]
    );
    return result.rows;
  }

  async findByMedicoAndPlano(medico_id, plano_id) {
    const result = await connection.query(
      'SELECT * FROM "MedicoPlanos" WHERE medico_id = $1 AND plano_id = $2',
      [medico_id, plano_id]
    );
    return result.rows[0] || null;
  }

  async delete(medico_id, plano_id) {
    const result = await connection.query(
      'DELETE FROM "MedicoPlanos" WHERE medico_id = $1 AND plano_id = $2',
      [medico_id, plano_id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new MedicoPlano();
