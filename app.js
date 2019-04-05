//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/testeapi';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//Esquema da collection do Mongo
var taskListSchema = mongo.Schema({
	nome : { type: String }, 
	ano : { type: String},
	plataforma: { type: String},
	descricao: { type: String},
	imagem: { type: String}
});

//Model da aplicação
var Model = mongo.model('Jogos', taskListSchema);

//GET - Retorna todos os registros existentes no banco
app.get("/jogos", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/jogos/:nome?", function (req, res) {
	var nome = req.params.nome;
	Model.find({'nome': nome}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//POST - Adiciona um registro
app.post("/jogos", function (req, res) {
	var register = new Model({
		nome : req.body.nome, 
	  ano : req.body.ano,
	  plataforma: req.body.plataforma,
	  descricao: req.body.descricao,
	  imagem: req.body.imagem
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		}
	});
	res.send(register);
	res.end();
});

//PUT - Atualiza um registro
app.put("/jogos/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  {
    	return next(err);
    } else {
    	res.json(post);	
    }
  });
});

//DELETE - Deleta um registro
app.delete("/jogos/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//Porta de escuta do servidor
app.listen(8080, function() {
	console.log('Funcionando');
});


