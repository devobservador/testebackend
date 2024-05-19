const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/tabela');
const db = mongoose.connection;
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

const userSchema = new mongoose.Schema({
    name: String,
    telefone: Number,
    email: String
});

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/post', async (req, res) => {
    const { name_, number_, email_ } = req.body;
    const existingUser = await User.findOne({ email: email_ });
    if (existingUser) {
        return res.status(400).send('Erro: Usuário já cadastrado com esse e-mail.');
    }
    const newUser = new User({
        name: name_,
        telefone: number_,
        email: email_
    });
    await newUser.save();
    console.log(newUser);
    res.send('Formulário submetido com sucesso');
});

// Rota para a segunda página
app.get('/segunda-pagina', (req, res) => {
    console.log("Acessando a rota /segunda-pagina");
    res.sendFile(path.join(__dirname, "segunda-pagina.html"));
});

// Rota para lidar com o envio do formulário da segunda página
app.post('/segunda-pagina/post', async (req, res) => {
    // Lógica para lidar com o envio do formulário da segunda página
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
