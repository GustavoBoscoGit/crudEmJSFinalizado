const mysql = require("mysql2/promise");

async function conectarDB() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "listaCompra",
  });

  global.connection = connection;
  return global.connection;
}

async function listarProdutos() {
  const conexao = await conectarDB();
  const [registros] = await conexao.query("select * from produto;");

  return registros;
}

async function insertProduto(produto) {
  const conexao = await conectarDB();
  const sql = "insert into produto (prodNome, prodPreco, itemCod) values (?,?,?);";

  return await conexao.query(sql, [produto.nome, produto.preco, produto.tipo]);
}

async function apagarProduto(codigo){
    const conexao = await conectarDB();
    const sql = "delete from produto where prodCod=?;"
    return await conexao.query(sql, [codigo])
}

async function recuperarProduto(codigo){
  const conexao = await conectarDB();
  const sql = "select * from produto where prodCod=?;";
  const [produto] = await conexao.query(sql, [codigo]);
  return produto[0];
}

async function alterarProduto(produto){
  const conexao = await conectarDB();
  const sql = "update produto set prodNome=?, prodPreco=?, itemCod=? where prodCod=?;"
  conexao.query(sql, [produto.nome, produto.preco, produto.tipo, produto.codigo])
}

module.exports = { listarProdutos, insertProduto, apagarProduto, recuperarProduto, alterarProduto };
