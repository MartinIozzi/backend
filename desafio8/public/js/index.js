//CLIENTE
const socket = io(); //se le llama por convención "io" por el "socket.io";

function render (products) {
    let html = products.map((elem, index) => {
        return `<hr>
                <h3 class="nameProduct">Nombre: ${elem.name}</h3>
                <p>Descripcion: ${elem.description}</p>
                <p>Precio: ${elem.price}</p>
                <p>Codigo del producto: ${elem.code}</p>
                <p>Stock restante: ${elem.stock} productos</p>
                <p>Tipo de producto: ${elem.type}</p>
                <div>Archivo: ${elem.img}</div><br>
                <button class="btn-eliminar" id="${elem._id}">Eliminar producto</button>
            </hr>`;
    }).join(' ');
    
    document.getElementById('products').innerHTML = html;
}

socket.on ('send', (products) => {
    render(products)
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
        socket.emit ('delete', botonEliminar.id)
    });
});
});

function enviarProducto () {
    let products = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        type: document.getElementById("type").value,
        img: document.getElementById("img").value,
    }
    socket.emit('add', products);
}

let botonEnviar = document.getElementById("boton")
botonEnviar.addEventListener('click', (enviarProducto)) //si pongo parentesis se ejecuta solo
