const express = require('express')
const router = express.Router()

const userController = require('../controller/usuarios_controller')

router.post('/cadastro', userController.fazerCadastro)
router.post('/login', userController.fazerLogin)

module.exports = router