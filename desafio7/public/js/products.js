const socket = io();

function render (products, cartId) {
    let html = products.map((elem) => {
      try {
        return `<div class="col-md-3 card display bg-dark-subtle" style="width: 22rem;">
        <div class="card-body">
        <img src="${elem.img}" class="card-img-top" style="width: 12rem;" alt="...">
          <h4 class="card-title">${elem.name}</h4>
          <hr></hr>
          <p class="card-text">${elem.description}</p>
          <hr></hr>
          <p class="card-text">${elem.price}</p>
          <hr></hr>
          <p class="card-text">${elem.code}</p>
          <hr></hr>
          <p class="card-text">${elem.stock}</p>
          <hr></hr>
          <p class="card-text">${elem.type}</p>
          <hr></hr>
          <button class="btn-eliminar btn btn-danger" id="${elem._id}">Eliminar producto</button>
        </div>
        <hr>
        <form action="/api/carts/${cartId}/products/${elem._id}" method="post"><button class="btn btn-warning">Agregar al carrito</button></form>
      </div>`
      } catch (error) {
        console.log(error);
      } 
    }).join(' ');
    document.getElementById('products').innerHTML = html;
}

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