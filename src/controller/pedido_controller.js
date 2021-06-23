const mysql = require('../database/mysql').pool

exports.getPedidos = ((req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            `SELECT *
               FROM pedido
         INNER JOIN produto
                 ON produto.idproduto = pedido.idproduto`,
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    pedidos: resultado.map(pedido => {
                        return {
                            id_pedido: pedido.idpedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.idproduto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: "GET",
                                descricao: "Retorna detalhes de um pedido especifico",
                                url: "http://localhost/pedido/"+pedido.idpedido 
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})
exports.excluirUmPedido = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            'DELETE FROM pedido WHERE idpedido = ?;',
            [req.body.id_pedido],
            (error, resultado, fields) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error })}
                const response = {
                    mensagem: "Pedido removido com sucesso",
                    request: {
                        tipo: "POST",
                        url: 'http://localhost:3000/pedido',
                        body: {
                            quantidade: "Inteiro",
                            id_produto: "Inteiro"
                        }
                    }
                }
                return res.status(202).send( response )
            }
        )
    })
}
exports.getUmPedido = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) {return res.status(500).send({ error: error })}
        connect.query(
            'SELECT * FROM pedido WHERE idpedido = ?;',
            [req.params.id_pedido],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error })}

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado um pedido com esse ID'
                    })
                }
                const response = {
                    produto: {
                        id_pedido: resultado[0].idpedido,
                        id_produto: resultado[0].idproduto,
                        quantidade: resultado[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: "Retorna todos os pedidos",
                            url: "http://localhost:3000/pedidos"
                        }
                    }
                }
                return res.status(200).send( response )
            }
        )
    })
}
exports.solicitarPedido = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) { return res.status(500).send({ error: error }) }
        connect.query('SELECT * FROM produto WHERE idproduto  = ?;',
        [req.body.idproduto],
        (error, resultado, field) => {
            if (error) { return res.status(500).send({ error: error })}
            if (resultado.length == 0) {
                return res.status(404).send({
                    mensagem: 'Produto não encontrado...'
                })
            }
            connect.query(
                'INSERT INTO pedido (quantidade, idproduto) VALUES(?, ?);',
                [req.body.quantidade,req.body.idproduto],
                (error, resultado, field) => {
                    connect.release()
                    if (error) { return res.status(500).send({ error: error, response: null }) }
                    const response = {
                        mensagem: "Pedido inserido com sucesso",
                        pedidoCriado: {
                            idpedido: resultado.idpedido,
                            idproduto: req.body.idproduto,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/pedidos'
                            }
                        }
                    }
                    return res.status(201).send( response )
                }
            )
        })
    })
}
    