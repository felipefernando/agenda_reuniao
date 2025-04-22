const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3001;

// Configuração do banco de dados
const dbConfig = {
  host: "samkemao101",
  user: "sysweb",
  password: "ZqkNUCy9DnPjGuSG",
  database: "mondb",
};

app.use(cors());
app.use(express.json());

app.get("/api/meetings", async (req, res) => {
  const { dt_ini, dt_fim, local } = req.query;

  if (!dt_ini || !dt_fim || !local) {
    return res.status(400).json({ error: "Parâmetros dt_ini, dt_fim e local são obrigatórios." });
  }

  const query = `
    SELECT 
        nm_usu AS requester, 
        nm_sal AS room, 
        nm_obs AS subject, 
        UNIX_TIMESTAMP(dt_ini) * 1000 AS dateStart, 
        UNIX_TIMESTAMP(dt_fim) * 1000 AS dateEnd,
        CASE 
            WHEN dt_ini <= NOW() AND dt_fim >= NOW() THEN 0  -- Em andamento
            WHEN dt_ini > NOW() THEN 1                       -- Próxima
            ELSE 2                                          -- Concluída
        END AS status
    FROM AGENDAMENTO_AGENDA a
    INNER JOIN AGENDAMENTO_SALA b 
        ON a.id_sal = b.id_sal
    WHERE a.dt_ini BETWEEN ? AND ?
        AND nm_loc = ?
    ORDER BY 
        status ASC,  -- Primeiro critério: status (0=em andamento, 1=próxima, 2=concluída)
        dt_ini ASC   -- Segundo critério: data de início
    `;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(query, [dt_ini, dt_fim, local]);
    await connection.end();

    // Mapear os status numéricos para strings
    const mappedRows = rows.map(row => ({
      ...row,
      status: row.status === 0 ? "em andamento" : 
              row.status === 1 ? "próxima" : 
              "concluída"
    }));

    res.json(mappedRows);
  } catch (error) {
    console.error("Erro ao buscar reuniões:", error);
    res.status(500).json({ error: "Erro ao buscar reuniões." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});