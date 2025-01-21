const fs = require('fs');
const path = require('path');

// Caminho do arquivo de avaliações
const avaliacaoFilePath = path.join(process.cwd(), 'avaliacoes.json');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const novaAvaliacao = req.body;

        // Ler o arquivo de avaliações
        try {
            const data = fs.existsSync(avaliacaoFilePath) ? fs.readFileSync(avaliacaoFilePath, 'utf8') : '[]';
            const avaliacoes = JSON.parse(data);

            // Adicionar a nova avaliação
            avaliacoes.push(novaAvaliacao);

            // Escrever de volta no arquivo
            fs.writeFileSync(avaliacaoFilePath, JSON.stringify(avaliacoes, null, 2));

            return res.status(201).json({ success: true, message: 'Avaliação salva com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Erro ao salvar a avaliação.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: 'Método não permitido.' });
    }
};
