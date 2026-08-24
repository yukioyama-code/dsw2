import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import broadcast from './broadcast.js';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');

const apostas = [];

app.use(express.static(publicDirectory));

app.get('/', function (req, res) {
    res.redirect('/dashboard.html');
});

app.get('/publish', async function (req, res) {
    const cidade = req.query.cidade;
    const campeao = req.query.campeao;
    const agora = new Date().toLocaleString();
    const novaAposta = `${agora}: nova aposta de ${cidade} em ${campeao}`;
    console.log(novaAposta);
    apostas.push(novaAposta);
    res.send('Sucesso: <a href="index.html">Voltar</a>');
});

app.get('/subscribeNovasApostas', async function (req, res) {
    broadcast(res, apostas, (channel, count) => channel[count], 3000);
});

app.get('/subscribeTotalApostas', async function (req, res) {
    broadcast(res, apostas, (channel, count) => channel.length, 3000);
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
