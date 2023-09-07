const socket = io();

socket.on ('send', () => {
  try {
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
      const productId = botonEliminar.id;
      console.log(productId);
        socket.emit ('delete', productId);
    });
  });
  } catch (error) {
    console.log(error);
  }
});