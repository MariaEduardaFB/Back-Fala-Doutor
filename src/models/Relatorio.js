const connection = require("../database/db");

class Relatorio {
  async buscaAgendamentos(dataInicial, dataFinal) {
    const result = await connection.query(
      `SELECT 
        DATE(data_hora) as dia,
        COUNT(id) as quantidade
      FROM "Consultas"
      WHERE data_hora >= $1 AND data_hora <= $2
      GROUP BY DATE(data_hora)
      ORDER BY DATE(data_hora) ASC`,
      [`${dataInicial} 00:00:00`, `${dataFinal} 23:59:59`]
    );
    return result.rows;
  }

  async buscaAgendamentosPorMedico(dataInicial, dataFinal) {
    const result = await connection.query(
      `SELECT 
        m.id,
        m.nome,
        COUNT(c.id) as total_consultas,
        DATE(c.data_hora) as dia
      FROM "Medicos" m
      LEFT JOIN "Consultas" c ON m.id = c.medico_id
      WHERE c.data_hora >= $1 AND c.data_hora <= $2 OR c.data_hora IS NULL
      GROUP BY m.id, m.nome, DATE(c.data_hora)
      ORDER BY DATE(c.data_hora) DESC, m.nome ASC`,
      [`${dataInicial} 00:00:00`, `${dataFinal} 23:59:59`]
    );
    return result.rows;
  }

  async buscaAgendamentosPorPaciente(dataInicial, dataFinal) {
    const result = await connection.query(
      `SELECT 
        p.id,
        p.nome,
        COUNT(c.id) as total_consultas,
        DATE(c.data_hora) as dia
      FROM "Pacientes" p
      LEFT JOIN "Consultas" c ON p.id = c.paciente_id
      WHERE c.data_hora >= $1 AND c.data_hora <= $2 OR c.data_hora IS NULL
      GROUP BY p.id, p.nome, DATE(c.data_hora)
      ORDER BY DATE(c.data_hora) DESC, p.nome ASC`,
      [`${dataInicial} 00:00:00`, `${dataFinal} 23:59:59`]
    );
    return result.rows;
  }

  async resumoConsultasPorStatus(dataInicial, dataFinal) {
    const result = await connection.query(
      `SELECT 
        status,
        COUNT(id) as quantidade
      FROM "Consultas"
      WHERE data_hora >= $1 AND data_hora <= $2
      GROUP BY status
      ORDER BY quantidade DESC`,
      [`${dataInicial} 00:00:00`, `${dataFinal} 23:59:59`]
    );
    return result.rows;
  }
}

module.exports = new Relatorio();
