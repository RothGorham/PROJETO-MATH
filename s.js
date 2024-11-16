// Importar módulos
var express = require('express');
var mongoose = require('mongoose');
var app = express();

// Configurar conexão com MongoDB
const mongoURI = 'mongodb+srv://ROTHMATH:<EmUmsXxv6k7GPLu9>@math.vplgf.mongodb.net/?retryWrites=true&w=majority&appName=MATH';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('./public'));

// Configuração do servidor
var port = 80; // Pode usar qualquer porta disponível
app.listen(port, function() {
  console.log("Servidor rodando na porta " + port + "...");
});

