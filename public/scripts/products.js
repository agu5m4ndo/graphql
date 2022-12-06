const socket = io.connect();


//-------------------------------LISTA DE PRODUCTOS---------------------------------

//detiene el submit del formulario para crear productos (para poder manejar la info desde socket)
const productForm = document.getElementById('products-form')
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newProduct();
})

const newProduct = () => {
    const name = document.getElementById('name');
    const price = document.getElementById('price');
    const thumbnail = document.getElementById('thumbnail');

    const object = {
        name: name.value,
        price: price.value,
        thumbnail: thumbnail.value,
    }
    clearForm();
    socket.emit('new-product', object);
}

const clearForm = () => {
    productForm.reset();
}

//obtiene la plantilla de handlebars y la inserta en el html con sus datos
const createTable = (productos) => {
    return fetch('../views/products.hbs')
        .then(response => response.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos });
            const table = document.getElementById('table');
            table.innerHTML = html;
        })
        .catch(err => socket.emit('product-error', err))
}

//Obtiene la lista de productos
const createProductList = async() => {
    const productos = await fetch(`/api/productos`)
        .then(res => res.json())
        .then(data => { return data; })
        .catch(err => socket.emit('product-error', err))
    createTable(productos.result);
}

//Llamado desde el html, crea un nuevo producto
socket.on('products', () => createProductList())