const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const rotaProduto = require('./routes/products')
const rotaPedido = require('./routes/pedidos')
const rotaUsuario = require('./routes/usuarios')

app.use('/produto', rotaProduto)
app.use('/pedido', rotaPedido)
app.use('/usuario', rotaUsuario)

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, POST, GET')
        return res.status(200).send('OK!!')
    }
    next()
})


app.use((req, res, next) => {
    const error = new Error('Rota não encontrada...')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            message: error.message
        }
    })
})

module.exports = app