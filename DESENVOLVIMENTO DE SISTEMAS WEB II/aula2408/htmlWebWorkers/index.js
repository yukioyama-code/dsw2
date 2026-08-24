import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

var app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');

app.use(express.static(publicDirectory));

app.get('/', function (request, response) {
    response.sendFile(path.join(publicDirectory, 'pagina.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
