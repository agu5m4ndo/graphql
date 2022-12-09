const { buildSchema } = require("graphql");
const crypto = require("crypto");

const schema = buildSchema(`
type Producto {
    id: ID!,
    name: String,
    price: Int,
    thumbnail: String
},
input inputProducto {
    name: String,
    price: Int,
    thumbnail: String
},
type Query {
    getProductById(id: ID!): Producto,
    getAllProducts: [Producto],
},
type Mutation {
    saveProduct(object: inputProducto): Producto,
    deleteProductById(id: ID!): Producto,
}
`)

module.exports = schema;