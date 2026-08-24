import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');

const jogadas = [];

app.use(express.static(publicDirectory));

app.get('/', function (req, res) {
    res.redirect('/placar.html');
});

app.get('/publish', async function(req, res) {
    console.log(`Novo evento: ${req.query.jogada}`)
    jogadas.push(req.query.jogada);
    res.send('Sucesso: <a href="admin.html">Voltar</a>');
});

app.get('/subscribe', async function (req, res) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();

    // Diz ao cliente para tentar novamente a cada 10 segundos
    // Caso a conexão seja perdida
    res.write('retry: 10000\n\n');
    let count = 0;

    while (true) {
        if(count == jogadas.length) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log(`Sem jogadas novas por enquanto: ${count} == ${jogadas.length}`);
        } else {
            console.log(`Nova jogada: ${jogadas[count]}`);
            res.write(`data: ${jogadas[count]}\n\n`);
            count++;
        }
    }
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
