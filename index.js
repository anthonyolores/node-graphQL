const express = require('express');
const expressGraphQL = require('express-graphql');
const graphQLSchema = require('./graphql-schema.js');

const app = express();

app.use('/nodegraphql', expressGraphQL({
    schema:graphQLSchema,
    graphiql:true
}));

app.listen(4000, () => {
    console.log('Server is running on port 4000..');
});