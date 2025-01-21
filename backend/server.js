const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const avaliacaoFilePath = path.join(__dirname, 'avaliacoes.js');

// Rota para receber avaliações
app.post('/avaliacao', (req, res) => {
    const novaAvaliacao = req.body;

    // Ler o arquivo atual
    fs.readFile(avaliacaoFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erro ao ler o arquivo de avaliações.' });
        }

        let avaliacoes = [];
        if (data) {
            avaliacoes = JSON.parse(data.replace('module.exports = ', ''));
        }

        // Adicionar a nova avaliação
        avaliacoes.push(novaAvaliacao);

        // Escrever de volta no arquivo
        const fileContent = `module.exports = ${JSON.stringify(avaliacoes, null, 2)};`;
        fs.writeFile(avaliacaoFilePath, fileContent, (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ success: false, message: 'Erro ao salvar a avaliação.' });
            }

            res.status(201).json({ success: true, message: 'Avaliação salva com sucesso.' });
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
