const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ destino: ' /uploads/'})
const login = require('../middleware/login')

const produtoController = require('../controller/produto_controller')

router.get('/', login.obrigatorio, produtoController.getProdutos)
router.get('/:id_produto', login.obrigatorio, produtoController.getUmProduto)
router.post('/', login.obrigatorio, produtoController.criarProduto)
router.patch('/', login.obrigatorio, produtoController.alterarProduto)
router.delete('/', login.obrigatorio, produtoController.excluirProduto)

module.exports = router;