// Importar módulos
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

// Configurar conexão com MongoDB, especificando o banco de dados 'usuários'
const mongoURI = 'mongodb+srv://ROTHMATH:EmUmsXxv6k7GPLu9@math.vplgf.mongodb.net/usuarios?retryWrites=true&w=majority&appName=MATH';

mongoose.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB no banco usuários'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configurar body-parser para processar requisições POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Definir o esquema do usuário para estudantes
const studentSchema = new mongoose.Schema({
  cpf: { type: String, unique: true }, // CPF agora é a chave única
  password: String // Em um ambiente real, você deve armazenar senhas hashadas
});

// Definir o esquema do professor
const professorSchema = new mongoose.Schema({
  cpf: { type: String, unique: true }, // CPF também como chave única
  password: String // Em um ambiente real, você deve armazenar senhas hashadas
});

// Definir o esquema de acesso
const acessoSchema = new mongoose.Schema({
  cpf: { type: String, unique: true },
  professor: Boolean
});

// Definir os modelos para as coleções 'ALUNOS', 'PROFESSORES' e 'ACESSO'
const Student = mongoose.model('Student', studentSchema, 'ALUNOS');
const Professor = mongoose.model('Professor', professorSchema, 'PROFESSORES');
const Acesso = mongoose.model('Acesso', acessoSchema, 'ACESSO');

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    return res.redirect('/login.html');
  }
  next();
}

// Rota de cadastro de aluno (com CPF e senha)
app.post('/win.html', async (req, res) => {
  const { cpf, password } = req.body;
  try {
    // Verificar se o CPF já está registrado na coleção ALUNOS
    const existingStudent = await Student.findOne({ cpf });
    if (existingStudent) {
      return res.redirect('/cpf2x.html'); // Redirecionar para cpf2x.html se o CPF já estiver em uso
    }

    // Criar um novo aluno na coleção ALUNOS
    const student = new Student({ cpf, password });
    await student.save();
    res.redirect('/win.html'); // Redirecionar para win.html
  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    res.redirect('/erro.html');
  }
});

// Rota de cadastro de professor (com verificação de acesso)
app.post('/winpro.html', async (req, res) => {
  const { cpf, password } = req.body;
  console.log('Tentativa de cadastro de professor:', { cpf, password });
  try {
    // Verificar se o CPF está na coleção ACESSO
    const acesso = await Acesso.findOne({ cpf });
    if (!acesso) {
      console.log('Acesso negado para CPF:', cpf);
      return res.redirect('/erro.html'); // Redirecionar para erro.html se não tiver permissão
    }

    // Verificar se o CPF já está registrado na coleção PROFESSORES
    const existingProfessor = await Professor.findOne({ cpf });
    if (existingProfessor) {
      console.log('CPF já registrado:', cpf);
      return res.redirect('/c2x.html'); // Redirecionar para c2x.html se o CPF já estiver em uso
    }

    // Criar um novo professor na coleção PROFESSORES
    const professor = new Professor({ cpf, password });
    await professor.save();
    console.log('Professor cadastrado com sucesso:', professor);
    res.redirect('/winpro.html'); // Redirecionar para winpro.html
  } catch (err) {
    console.error('Erro ao cadastrar professor:', err);
    res.redirect('/erro.html');
  }
});

// Rota de login (alunos e professores usando CPF)
app.post('/login', async (req, res) => {
  const { cpf, password } = req.body;
  console.log('Tentativa de login:', { cpf, password });

  try {
    let user;
    // Login usando CPF (alunos e professores usam CPF)
    user = await Student.findOne({ cpf, password }) || await Professor.findOne({ cpf, password });
    
    if (user) {
      console.log('Usuário encontrado:', user);
      res.cookie('sessionId', user._id, { httpOnly: true });
      
      if (user instanceof Student) {
        return res.redirect('/areaaluno.html'); // Redirecionar para área de aluno
      } else {
        return res.redirect('/areaprofessor.html'); // Redirecionar para área de professor
      }
    }

    console.log('Usuário não encontrado');
    res.redirect('/key.html'); // Redirecionar para key.html se falhar
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.redirect('/erro.html');
  }
});

// Rota protegida para área de aluno
app.get('/areaaluno.html', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/public/areaaluno.html');
});

// Rota protegida para área de professor
app.get('/areaprofessor.html', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/public/areaprofessor.html');
});

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('./public'));

// Servir o arquivo aulas.html
app.get('/aulas.html', (req, res) => {
  res.sendFile(__dirname + '/public/aulas.html');
});

// Configuração do servidor
const port = 3004;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}...`);
});

/* blog teste */

// Definir o esquema do post
const postSchema = new mongoose.Schema({
  titulo: String,
  conteudo: String,
  respostas: [{ conteudo: String, data: { type: Date, default: Date.now } }],
  data: { type: Date, default: Date.now }
});

// Definir o modelo para a coleção 'POSTS'
const Post = mongoose.model('Post', postSchema, 'POSTS');

// Rota para criar um novo post
app.post('/posts', async (req, res) => {
  const { titulo, conteudo } = req.body;

  try {
    const novoPost = new Post({ titulo, conteudo });
    await novoPost.save();
    res.status(201).json(novoPost);
  } catch (err) {
    console.error('Erro ao criar post:', err);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Rota para listar todos os posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error('Erro ao listar posts:', err);
    res.status(500).json({ error: 'Erro ao obter posts' });
  }
});

// Rota para deletar um post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(200).json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar post:', err);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

// Rota para responder a um post
app.post('/posts/:id/responder', async (req, res) => {
  const { id } = req.params;
  const { conteudo } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    post.respostas.push({ conteudo });
    await post.save();
    res.status(201).json(post.respostas[post.respostas.length - 1]);
  } catch (err) {
    console.error('Erro ao responder post:', err);
    res.status(500).json({ error: 'Erro ao responder post' });
  }
});

// Definir o esquema do conteúdo
const conteudoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  link: String,
  categoria: { type: String, enum: ['videos', 'exercicios', 'materia', 'avisos'], required: true }, // Adicionando categoria
  data: { type: Date, default: Date.now }
});

// Definir o modelo para a coleção 'CONTEUDOS'
const Conteudo = mongoose.model('Conteudo', conteudoSchema, 'CONTEUDOS');

// Rota para criar um novo conteúdo
app.post('/conteudos', async (req, res) => {
  const { titulo, descricao, link, categoria } = req.body;

  // Verificar se a categoria está presente
  if (!categoria) {
    return res.status(400).json({ error: 'Categoria é obrigatória' });
  }

  try {
    const novoConteudo = new Conteudo({ titulo, descricao, link, categoria });
    await novoConteudo.save();
    res.status(201).json(novoConteudo);
  } catch (err) {
    console.error('Erro ao criar conteúdo:', err);
    res.status(500).json({ error: 'Erro ao criar conteúdo' });
  }
});

// Rota para listar todos os conteúdos
app.get('/conteudos', async (req, res) => {
  try {
    const conteudos = await Conteudo.find();
    res.json(conteudos);
  } catch (err) {
    console.error('Erro ao listar conteúdos:', err);
    res.status(500).json({ error: 'Erro ao obter conteúdos' });
  }
});

// Rota para deletar um conteúdo
app.delete('/conteudos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const conteudo = await Conteudo.findByIdAndDelete(id);
    if (!conteudo) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }
    res.status(200).json({ message: 'Conteúdo deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar conteúdo:', err);
    res.status(500).json({ error: 'Erro ao deletar conteúdo' });
  }
});

// Rota para buscar aluno pelo CPF
app.get('/buscar-aluno/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const aluno = await Student.findOne({ cpf });
    if (aluno) {
      res.status(200).json({ message: 'Aluno encontrado', aluno });
    } else {
      res.status(404).json({ message: 'Aluno não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    res.status(500).json({ message: 'Erro ao buscar aluno' });
  }
});

// Definir o esquema de presença
const presencaSchema = new mongoose.Schema({
  cpf: String,
  materias: String,
  diaSemana: String,
  horaEntrada: String,
  horaSaida: String,
  idade: Number,
  data: { type: Date, default: Date.now }
});

// Definir o modelo para a coleção 'PRESENCAS'
const Presenca = mongoose.model('Presenca', presencaSchema, 'PRESENCAS');

// Rota para registrar presença
app.post('/registrar-presenca', async (req, res) => {
  const { cpf, materias, diaSemana, horaEntrada, horaSaida, idade, instituicao } = req.body;

  try {
    const novaPresenca = new Presenca({ cpf, materias, diaSemana, horaEntrada, horaSaida, idade, instituicao });
    await novaPresenca.save();
    res.status(201).json({ message: 'Presença registrada com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar presença:', err);
    res.status(500).json({ error: 'Erro ao registrar presença' });
  }
});