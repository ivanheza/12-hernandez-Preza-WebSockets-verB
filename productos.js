
///
module.exports = class Producto {
    constructor(name, price, image) {
       this.name = name
       this.price = price
       this.image = image
    }
 
    nuevoProducto(array) {
       if (array.length === 0) {
          return array.push({
             id: 1,
             name: this.name,
             price: this.price,
             image: this.image,
          })
       } else {
          array.push({
             id: array.length + 1,
             name: this.name,
             price: this.price,
             image: this.image,
          })
       }
    }
 }





