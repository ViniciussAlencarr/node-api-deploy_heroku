const mysql = require('../database/mysql').pool
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')

exports.fazerCadastro = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) { return res.status(500).send({  error: error }) }
        mysql.query('SELECT * FROM usuarios WHERE email = ?;',
        [req.body.email],
        (error, resultado, field) => {
            if (resultado.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10,  (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    connect.query('INSERT INTO usuarios (email, senha) VALUES (?, ?);',
                    [req.body.email, hash],
                    (error, resultado, field) => {
                        connect.release()
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                id_usuario: resultado.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send( response )
                    })
                })
            }
        })
    })
}
exports.fazerLogin = (req, res, next) => {
    mysql.getConnection((error, connect) => {
        if (error) { return res.status(500).send({ error: error })}
        const query = 'SELECT * FROM usuarios WHERE email = ?'
        connect.query(query,
            [req.body.email],
            (error, resultado, fields) => {
                connect.release()
                if (error) { return res.status(500).send({ error: error }) }
                if (resultado.length < 1) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                bcrypt.compare(req.body.senha, resultado[0].senha, (error, result) => {
                    if (error) {
                        return res.status(401).send({ mensagem: 'Falha na autenticação' })
                    }
                    // if true
                    if (result) {
                        const token = jwt.sign({
                            id_usuario: resultado[0].idusuario,
                            email: resultado[0].email,
                        }, process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        return res.status(200).send({
                            mensagem: "Autenticado com sucesso!",
                            token: token
                        })
                    }
                    
                    // if resultado == false, ou, senha incorreta
                    return res.status(401).send({ mensagem: "Falha na autenticação" })
                })
            })
    })
}