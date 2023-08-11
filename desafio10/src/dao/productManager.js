import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = ('./models/products.json');
        
        //Creo este código para que si no existe nada en el JSON cree igual lo que vendria siendo el array donde contendría los productos.
        if (!(fs.existsSync(this.path))) {
            fs.writeFileSync(
                this.path,
                JSON.stringify([]))
        }else{
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
    }
    //Creo el parse en donde los productos del JSON se quedan para poder utilizarlo en las funciones de mas adelante.
    async getProducts(){
        try {
            const actualProducts = await (fs.promises.readFile(this.path, 'utf-8'));
            return JSON.parse(actualProducts);
        } catch (e) {
            console.log(e);
        }
    };

    //Se agregan los productos, los cuales son aclarados abajo, al array de productos creado en el código de this.path.
    async addProduct(product) {
        try {
            let products = await this.getProducts()
            //Esto verifica que el código específico del producto (ejemplo: "abc123"), no se repita mas de una vez, en tal caso, saltaría el error.
            if(products.find(element => element.code == product.code) != undefined){
                return console.log('Error al agregar producto: Ya existe el código "' + product.code + '"')
            }
        
            
            let id = 0  //creo una variable que contenga la id
            let index = products.length - 1 //creo una variable que reste en 1 el valor del length de los productos.
            if(index >= 0){     //si el index es mayor igual a 0,
                id = products[index].id //entonces id vale la id del producto del momento, la cual se verifica con el index y se aplica la id
                id++    //al verificar eso, para el proximo producto a crear se suma +1 el valor de la ultima id.
            }
            product.id = id.toString();     //el id del producto en el que se estaría trabajando se convierte en string
            products.push(product); 
            this.updateProducts(products);  

        } catch (err) {
            console.log(err);
        }
    }

    async updateProducts(products){
        try {
            await fs.promises.writeFile(this.path,
                JSON.stringify(products))
        } catch (e) {
            console.log(e);
        }

    }
    //Este metodo, seleccionaría una id, escrita al final del código, la cual permita filtrar por ID los productos.
    async getProductByID(id){
        try {
            const actualProducts = await this.getProducts()
            return actualProducts.find(element => element.id == id)
        } catch (e) {
            console.log(e);
        }

    }
    
    //Este metodo permite leer el codigo, del array que contiene la lista de los productos.

    readCodes(){
        try {
            let readCode = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            return readCode;
        } catch (e) {
            console.log(e);  
        }

    }

    //Este metodo, permite, seleccionando la ID del producto, poder sobreescribir los datos de uno seleccionado.
    async updateProduct(id, product) {
        try {
            let products = await this.getProducts()
            let index = products.findIndex(element => element.id == id);
            product.id = id;
            products[index] = product;
            fs.writeFileSync(this.path, JSON.stringify(products));
            if(index == -1){return console.log('Error al actualizar producto: No existe la ID: ' + id)}
        } catch (e) {
            console.log("No existe la ID: " + id, e)
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts()
            let index = products.findIndex(element => element.id == id);
            if(index == -1){return console.log('Error al borrar producto: No existe la ID: ' + id)}
    
            products.splice(index, 1);
            fs.writeFileSync(this.path, JSON.stringify(products));
        } catch (e) {
            console.log(e);
        }

    }
}

export default ProductManager;