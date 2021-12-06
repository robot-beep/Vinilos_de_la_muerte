const express = require('express');
const router = express.Router();
const Producto = require('../models/productos')

// Página principal
router.get('/', async (req,res) => {
    const productos = await Producto.find();
    res.render("home",{
        productos: productos
  });
});



module.exports = router;