// Importar módulos
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const excel = require('exceljs');

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
  name: String,
  cpf: { type: String, unique: true },
  password: String
});

const professorSchema = new mongoose.Schema({
  name: String,
  cpf: { type: String, unique: true },
  password: String
});

// Definir o esquema de acesso
const acessoSchema = new mongoose.Schema({
  cpf: { type: String, unique: true },
  professor: Boolean
});

// Definir o esquema de presença
const attendanceSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  studentName: String,
  cpf: String,
  subject: String,
  date: Date,
  dayOfWeek: String,
  hours: String,
  observation: String,
  grade: Number,
  professorName: String // Novo campo para o nome do professor
});

// Definir os modelos para as coleções 'ALUNOS', 'PROFESSORES', 'ACESSO' e 'PRESENCA'
const Student = mongoose.model('Student', studentSchema, 'ALUNOS');
const Professor = mongoose.model('Professor', professorSchema, 'PROFESSORES');
const Acesso = mongoose.model('Acesso', acessoSchema, 'ACESSO');
const Attendance = mongoose.model('Attendance', attendanceSchema, 'PRESENCA');

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    return res.redirect('/login.html');
  }
  next();
}

// Rota de cadastro de aluno
app.post('/win.html', async (req, res) => {
  const { name, cpf, password } = req.body;
  try {
    const existingStudent = await Student.findOne({ cpf });
    if (existingStudent) {
      return res.redirect('/cpf2x.html');
    }

    const student = new Student({ name, cpf, password });
    await student.save();
    res.redirect('/win.html');
  } catch (err) {
    console.error('Erro ao cadastrar aluno:', err);
    res.redirect('/erro.html');
  }
});

// Rota de cadastro de professor (com verificação de acesso)
app.post('/winpro.html', async (req, res) => {
  const { name, cpf, password } = req.body;
  console.log('Tentativa de cadastro de professor:', { name, cpf, password });
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
    const professor = new Professor({ name, cpf, password });
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



app.get('/attendance/download', async (req, res) => {
  try {
    const attendances = await Attendance.find();
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Presenças');

    worksheet.columns = [
      { header: 'Nome do Aluno', key: 'studentName', width: 30 },
      { header: 'CPF', key: 'cpf', width: 20 },
      { header: 'Matéria', key: 'subject', width: 30 },
      { header: 'Data da Aula', key: 'date', width: 15 },
      { header: 'Dia da Semana', key: 'dayOfWeek', width: 15 },
      { header: 'Horas', key: 'hours', width: 10 },
      { header: 'Observação', key: 'observation', width: 30 },
      { header: 'Nota', key: 'grade', width: 10 },
      { header: 'Nome do Professor', key: 'professorName', width: 30 } // Novo campo para o nome do professor
    ];

    attendances.forEach(attendance => {
      worksheet.addRow({
        studentName: attendance.studentName,
        cpf: attendance.cpf,
        subject: attendance.subject,
        date: attendance.date,
        dayOfWeek: attendance.dayOfWeek,
        hours: attendance.hours,
        observation: attendance.observation,
        grade: attendance.grade,
        professorName: attendance.professorName // Incluir o nome do professor
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=presencas.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Erro ao baixar dados de presença:', err);
    res.status(500).json({ error: 'Erro ao baixar dados de presença' });
  }
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

// Rota para buscar aluno pelo CPFnpm install exceljs
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

/* ========================================= */

// Rota para listar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Student.find();
    res.json(alunos);
  } catch (err) {
    console.error('Erro ao listar alunos:', err);
    res.status(500).json({ error: 'Erro ao listar alunos' });
  }
});

// Rota para alterar a senha de um aluno
app.put('/alunos/:id/alterar-senha', async (req, res) => {
  const { id } = req.params;
  const { novaSenha } = req.body;

  try {
    const aluno = await Student.findById(id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    aluno.password = novaSenha;
    await aluno.save();
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

// Rota para deletar um aluno
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const aluno = await Student.findByIdAndDelete(id);
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.status(200).json({ message: 'Aluno deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar aluno:', err);
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
});

// Rota para buscar alunos pelo nome ou CPF
app.get('/buscar-aluno', async (req, res) => {
  const { query } = req.query;
  try {
    const alunos = await Student.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { cpf: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(alunos);
  } catch (err) {
    console.error('Erro ao buscar alunos:', err);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

/* ================= */

// Rota para deletar todos os conteúdos
app.delete('/conteudos', async (req, res) => {
  try {
    await Conteudo.deleteMany({});
    res.status(200).json({ message: 'Todos os conteúdos foram apagados com sucesso' });
  } catch (err) {
    console.error('Erro ao apagar todos os conteúdos:', err);
    res.status(500).json({ error: 'Erro ao apagar todos os conteúdos' });
  }
});


app.post('/attendance', async (req, res) => {
  const { studentId, subject, date, dayOfWeek, hours, grade, observation, professorName } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const attendance = new Attendance({
      studentId,
      studentName: student.name,
      cpf: student.cpf,
      subject,
      date,
      dayOfWeek,
      hours,
      grade,
      observation,
      professorName // Incluir o nome do professor
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    console.error('Erro ao registrar presença:', err);
    res.status(500).json({ error: 'Erro ao registrar presença' });
  }
});

// Função para buscar presenças detalhadas
async function fetchAttendanceDetails() {
  try {
    const response = await fetch('/attendance/details');
    if (response.ok) {
      const attendances = await response.json();
      renderAttendanceDetails(attendances);
    } else {
      console.error('Erro ao buscar presenças detalhadas');
    }
  } catch (error) {
    console.error('Erro ao buscar presenças detalhadas:', error);
  }
}

// Função para renderizar presenças detalhadas
function renderAttendanceDetails(attendances) {
  const container = document.getElementById('attendanceDetailsContainer');
  container.innerHTML = '';
  attendances.forEach(attendance => {
    const attendanceElement = document.createElement('div');
    attendanceElement.className = 'attendance-card';
    attendanceElement.innerHTML = `
      <h3>Nome: ${attendance.studentName}</h3>
      <p>CPF: ${attendance.cpf}</p>
      <p>Data: ${new Date(attendance.date).toLocaleDateString()}</p>
      <p>Hora: ${attendance.hours}</p>
      <p>Observação: ${attendance.observation}</p>
      <p>Nota: ${attendance.grade}</p>
    `;
    container.appendChild(attendanceElement);
  });
}


// Rota para deletar todos os alunos
app.delete('/students', async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({ message: 'Todos os alunos foram excluídos com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir todos os alunos:', err);
    res.status(500).json({ error: 'Erro ao excluir todos os alunos' });
  }
});

// Rota para adicionar professor ao banco de dados
app.post('/acesso', async (req, res) => {
  const { cpf } = req.body;
  try {
    const existingAccess = await Acesso.findOne({ cpf });
    if (existingAccess) {
      return res.status(400).json({ error: 'Professor já existe' });
    }

    const acesso = new Acesso({ cpf, professor: true });
    await acesso.save();
    res.status(201).json(acesso);
  } catch (err) {
    console.error('Erro ao adicionar professor:', err);
    res.status(500).json({ error: 'Erro ao adicionar professor' });
  }
});