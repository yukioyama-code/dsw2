import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');

app.use(express.static(publicDirectory));

app.get('/', function (req, res) {
    res.sendFile(path.join(publicDirectory, 'pagina.html'));
});

app.get('/eventos', async function (req, res) {
    console.log('Request /eventos');
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
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('Evento', ++count);
        // res.write escreve algo na saída, sem encerrar o fluxo
        res.write(`data: Evento ${count}\n\n`);
    }
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
