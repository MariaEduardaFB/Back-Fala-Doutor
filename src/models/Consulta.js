const connection = require("../database/db");

class Consulta {
  async findAll(dataInicial = null, dataFinal = null) {
    let query = 'SELECT * FROM "Consultas" ORDER BY "data_hora" DESC';
    const params = [];

    if (dataInicial && dataFinal) {
      query = 'SELECT * FROM "Consultas" WHERE data_hora >= $1 AND data_hora <= $2 ORDER BY "data_hora" DESC';
      params.push(`${dataInicial} 00:00:00`, `${dataFinal} 23:59:59`);
    }

    const result = await connection.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await connection.query(
      'SELECT * FROM "Consultas" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(paciente_id, medico_id, plano_id, data_hora, descricao) {
    const result = await connection.query(
      'INSERT INTO "Consultas" (paciente_id, medico_id, plano_id, data_hora, descricao, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [paciente_id, medico_id, plano_id, data_hora, descricao, 'agendada']
    );
    return result.rows[0];
  }

  async update(id, data_hora, descricao, status) {
    const result = await connection.query(
      'UPDATE "Consultas" SET data_hora = $1, descricao = $2, status = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
      [data_hora, descricao, status, id]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await connection.query(
      'DELETE FROM "Consultas" WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = new Consulta();
