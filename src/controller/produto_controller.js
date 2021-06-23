const mysql = require('../database/mysql').pool

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            'SELECT * FROM produto;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    quantidade: resultado.length,
                    produtos: resultado.map(produto => {
                        return {
                            id_produto: produto.idproduto,
                            nome: produto.nome,
                            preco: produto.preco,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna detalhes de um produto especifico",
                                url: "http://localhost/produto/"+produto.idproduto 
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
}
exports.getUmProduto = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            'SELECT * FROM produto WHERE idproduto = ?;',
            [req.params.id_produto],
            (error, resultado, fields) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error })}

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um produto com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_produto: resultado[0].idproduto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: "Retorna todos os produtos",
                            url: "http://localhost:3000/produto"
                        }
                    }
                }
                return res.status(200).send( response )
            }
        )
    })
}
exports.criarProduto = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        connect.query(
            'INSERT INTO produto (nome, preco) VALUES(?, ?);',
            [req.body.nome,req.body.preco],
            (error, resultado, field) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error, response: null }) }
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produto'
                        }
                    }
                }
                return res.status(201).send( response )
            }
        )
    })

}
exports.alterarProduto = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            `UPDATE produto
                SET   nome       = ?,
                      preco      = ? 
                WHERE idproduto = ?;`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, resultado, fields) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    mensagem: "Produto atualizado com sucesso",
                    produtoAlterado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto especifico',
                            url: 'http://localhost:3000/produto/'+req.body.id_produto
                        }
                    }
                }
                return res.status(202).send( response )
            }
        )

    })
}

exports.excluirProduto = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            'DELETE FROM produto WHERE idproduto = ?;',
            [req.body.id_produto],
            (error, resultado, fields) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    mensagem: "Produto removido com sucesso",
                    request: {
                        tipo: "POST",
                        url: 'http://localhost:3000/produto',
                        body: {
                            nome: "String",
                            preco: "Float"
                        }
                    }
                }
                return res.status(202).send( response )
            }
        )

    })

}