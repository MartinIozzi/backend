export class ProductDTO {
    constructor(product){
        this.name = product.name,
        this.img = product.image,
        this.stock = product.stock,
        this.price = product.precio,
        this.description = product.descripcion,
        this.code = product.codigo,
        this.type = product.tipo,
        this.active = true;
    }
}
/*
export class UserDTO{
    constructor(user){
        this.first_name = user.name;
        this.last_name = user.lastname;
        this.email = user.email;
        this.age = user.age;
        this.img = user.img;
        this.cart = user.cart;
    }
}
*/