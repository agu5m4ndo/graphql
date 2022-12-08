const { graphqlHTTP } = require('express-graphql');
const schema = require('../utils/buildSchema')
const SQLFactory = require('../persistence/factory');
const factory = new SQLFactory();
const ProductoDaoMariadb = factory.create('product');
const root = {
    saveProduct: ProductoDaoMariadb.saveProduct,
    getProductById: ProductoDaoMariadb.getProductById,
    getAllProducts: ProductoDaoMariadb.getAllProducts,
    deleteProductById: ProductoDaoMariadb.deleteProductById
}

module.exports = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
})