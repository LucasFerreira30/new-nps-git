const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Não é necessário, mas está incluído se precisar de configurações mais complexass

// Caminho do arquivo de avaliações
const avaliacaoFilePath = path.join(process.cwd(), 'avalicao.js');

module.exports = async (req, res) => {
    // Configuração CORS (para resolver o erro OPTIONS)
    if (req.method === 'OPTIONS') {
        // Definir cabeçalhos CORS necessários
        res.setHeader('Access-Control-Allow-Origin', '*'); // Permite requisições de qualquer origem
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Permite métodos POST e OPTIONS
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Permite cabeçalhos Content-Type
        return res.status(200).end(); // Finaliza a requisição OPTIONS
    }

    // Processo para requisição POST
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
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        return res.status(405).json({ success: false, message: 'Método não permitido.' });
    }
};
