// Importar módulos
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// Configurar conexão com MongoDB, especificando o banco de dados 'usuários'
const mongoURI = 'mongodb+srv://ROTHMATH:EmUmsXxv6k7GPLu9@math.vplgf.mongodb.net/usuarios?retryWrites=true&w=majority&appName=MATH';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB no banco usuários'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configurar body-parser para processar requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definir o esquema do usuário para estudantes
var studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String // Em um ambiente real, você deve armazenar senhas hashadas
});

// Definir o esquema do professor
var professorSchema = new mongoose.Schema({
  cpf: String,
  password: String // Em um ambiente real, você deve armazenar senhas hashadas
});

// Definir os modelos para as coleções 'ALUNOS' e 'PROFESSORES'
var Student = mongoose.model('Student', studentSchema, 'ALUNOS');
var Professor = mongoose.model('Professor', professorSchema, 'PROFESSORES');


// Handle the POST request to /win.html
app.post('/win.html', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar se o e-mail já está registrado na coleção ALUNOS
    const existingStudent = await Student.findOne({ email: email });
    if (existingStudent) {
      return res.redirect('/email2x.html'); // Redirecionar para email2x.html
    }
    // Create a new student in the ALUNOS collection
    const student = new Student({ name, email, password });
    await student.save();
    res.redirect('/win.html'); // Redirect to win.html
  } catch (err) {
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});


// Rota de cadastro de professor
app.post('/register-professor', async (req, res) => {
  const { cpf, password } = req.body;
  try {
    // Verificar se o CPF já está registrado na coleção 'PROFESSORES'
    const existingProfessor = await Professor.findOne({ cpf: cpf });
    if (existingProfessor) {
      return res.status(400).send('CPF já registrado.');
    }

    // Criar um novo professor na coleção 'PROFESSORES'
    const professor = new Professor({ cpf, password });
    await professor.save();
    res.send('Cadastro de professor bem-sucedido!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar professor.');
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    if (username.includes('@')) {
      // Login como estudante (email e senha)
      user = await Student.findOne({ email: username, password: password });
      if (user) {
        res.redirect('/areaaluno.html');
      } else {
        res.send('Credenciais inválidas para estudante.');
      }
    } else {
      // Login como professor (CPF e senha)
      user = await Professor.findOne({ cpf: username, password: password });
      if (user) {
        res.redirect('/areaprofessor.html');
      } else {
        res.send('Credenciais inválidas para professor.');
      }
    }
  } catch (err) {
    res.status(500).send('Erro no servidor.');
  }
});

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('./public'));

// Configuração do servidor
var port = 3000; // Escolha uma porta disponível
app.listen(port, function() {
  console.log("Servidor rodando na porta " + port + "...");
});
