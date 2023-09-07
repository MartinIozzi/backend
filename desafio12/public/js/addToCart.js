const socket = io();

function render (products, cid) {
    let html = products.map((elem) => {
        return `
        <form action="/api/carts/${cid}/products/${elem._id}" method="post"><button class="btn btn-warning">Agregar al carrito</button></form>`
    })};

socket.on ('send', (products) => {
  try {
    render(products)
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
      const productId = botonEliminar.id;
        socket.emit ('delete', productId);
    });
  });
  } catch (error) {
    console.log(error);
  }
});
