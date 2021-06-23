const express = require('express')
const router = express.Router()

const pedidosController = require('../controller/pedido_controller')

router.get('/', pedidosController.getPedidos)
router.get('/:id_pedido', pedidosController.getUmPedido)
router.post('/', pedidosController.solicitarPedido)
router.delete('/', pedidosController.excluirUmPedido)

module.exports = router;