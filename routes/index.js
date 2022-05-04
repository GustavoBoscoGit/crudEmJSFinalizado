var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {

    if(!global.usuario || global.usuario == 0){
      res.redirect('/login')
    }

    const registros = await global.db.listarProdutos();

    res.render("index", { registros });

});

router.get('/sair', function(req, res){
  global.usuario = 0;
  res.redirect('/')
})

router.get('/login', function(req, res){
  res.render('login')
})

router.post('/login', async function(req,res){
  const usuario = req.body.edtUser
  const senha = req.body.edtPassword

  const user = await global.db.buscarUsuario({usuario, senha});

  global.usuario = user.userCod;
  res.redirect('/')
})

router.get("/adicionarProduto", function (req, res) {
  res.render("formProduto", { titulo: "Adicionar Produto", acao: "/adicionarProduto", produto:{} });
});

router.post('/adicionarProduto', async function(req, res){
  const nome = req.body.edtNome;
  const preco = req.body.edtPreco;
  const tipo = req.body.selTipo;

  await global.db.insertProduto({nome, preco, tipo})
  res.redirect('/')
})

router.get('/alteraProduto/:id', async function(req, res){
  const codigo = parseInt(req.params.id)
  const produto = await global.db.recuperarProduto(codigo)
  res.render("formProduto", { titulo: "Alteração de Produto", acao: "/alteraProduto/"+codigo, produto });
})

router.get('/apagaProduto/:id', async function(req, res){
  const codigo = parseInt(req.params.id)
  await global.db.apagarProduto(codigo)
  res.redirect('/')
})

router.post('/alteraProduto/:id', async function(req, res){
  const codigo = parseInt(req.params.id);
  const nome = req.body.edtNome;
  const preco = parseFloat(req.body.edtPreco);
  const tipo = parseInt(req.body.selTipo);

  await global.db.alterarProduto({codigo, nome, preco, tipo});
  res.redirect('/')
})



module.exports = router;
