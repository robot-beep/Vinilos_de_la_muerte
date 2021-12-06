const express = require('express');
const router = express.Router();
const Producto = require('../models/productos')
const Cliente = require('../models/clientes')
const multer = require('multer');
const { request } = require('express');
const fs = require('fs');
const { carrito } = require('../const/const');


//Storage images

const storage = multer.diskStorage({

  //lugar para guardar imagenes 
  destination: function (request, file, callback) {
    callback(null, './src/public/images');
  },

  //add back extension 
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname)
  },
});

//upload parameters 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
});

//RUTA DE COMPRA 
router.get('/individual-card/:id', async (req, res) => {
  const { id } = req.params;
  const productos = await Producto.findById(id);
  res.render("card/individual-card", {
    productos: productos
  });
});

// RUTA PARA AGREGAR PRODUCTOS 
router.get('/new-product', async (req, res) => {
  res.render("productos/new-product");
});

// GUARDAR PRODUCTO
router.post('/add', upload.single('image'), async (req, res) => {
  const { titulo, autor, formato, genero, estado, descuento, valor, stock } = req.body;
  const image = req.file ? (req.file.filename) : null;
  const productos = await new Producto({ titulo, autor, formato, genero, estado, descuento, valor, stock, image });
  await productos.save();
  res.redirect("/productos");
});

// Mostrar productos
router.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.render("productos/all-products", {
    productos: productos
  });
});


//BORRAR
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const oldProducto = await Producto.findById(id);
  if (oldProducto.image !== null) await fs.unlink(`./src/public/images/${oldProducto.image}`, () => { });
  await Producto.deleteOne({ _id: id });
  res.redirect("/productos");

});

//MODIFICAR
router.get('/modify/:id', async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findById(id);
  res.render('productos/modify-product', { producto });
});

router.post('/modify-product/:id', async (req, res) => {
  const { id } = req.params;
  await Producto.updateOne({ _id: id }, req.body);
  res.redirect("/productos");
});

//AGREGAR AL CARRITO
router.get('/agregar-producto-carrito/:id', async (req, res) => {
  const parametro = req.params;
  const indexFound = carrito.findIndex(({ id }, index) => {
    if (parametro.id === id) {
      carrito[index].cantidad += 1;
      return true;
    }
  });
  if (indexFound < 0) {
    carrito.push({ id: parametro.id, cantidad: 1 });
  }
  console.log(carrito);
  res.redirect('/individual-card/' + parametro.id);
});

//ELIMINAR DEL CARRITO 
router.get('eliminar-producto-carrito/:id', async (req, res) => {
  const parametro = req.params; 
  const indexFound = carrito.findIndex(({id}, index) => {
    if(parametro.id === id) {
      carrito[index].cantidad -= 1; 
    }
  });
  if (indexFound < 0) {
    console.log("este producto no está en el carrito");
  }
  console.log(carrito);
  res.redirect('/');
});

//Calcular precio total del carrito 
router.get('/pagar/:total', (req, res)=>{
  let total = req.params;
  console.log(total);
  res.render('carrito/pago', {
    total : total
  });
});

router.post('/pago', async (req, res)=>{
  const { email, nombre, rut, telefono, direccion, comuna, region} = req.body;
  const cliente = await new Cliente({email, nombre, rut, telefono, direccion, comuna, region});
  await cliente.save();
  res.redirect('/');
});
  

//carrito 
router.get('/user-carrito', async (req, res)=>{
  let productos = [];
  let total = 0;
  let cantidad = [];
  let descuento = 0; 
  for(let i=0; i < carrito.length; i++){
    let articulo = await Producto.findById(carrito[i].id);
    productos.push(articulo);
    cantidad.push(carrito[i].cantidad);
  }
  for(let i=0; i < productos.length; i++ ){
    descuento = (productos[i].valor * (1 + (productos[i].descuento/100))) - productos[i].valor ;
    console.log(descuento);
    total = (total + (cantidad[i]*(productos[i].valor - ( descuento))));
    
  }
  console.log("total:" + total);
  console.log(productos); 
  res.render('carrito/user-carrito', {
    productos: productos,
    total: total.toFixed(),
    cantidad: cantidad
  });
});

module.exports = router;


