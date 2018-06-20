const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const people = [
    {id:'1', name:'Brian Knight', age:44},
    {id:'2', name:'Rudy Gay', age:56},
    {id:'3', name:'Stephen Hawking', age:57},
];

const PersonType = new GraphQLObjectType({
    name:'Person',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
});

// Root Query
const GetQuery= new GraphQLObjectType({
    name:'GetQuery',
    fields:{
        /*graphql query
        {
            GetPerson(id:'1')
            {
                id,
                name,
                age
            }
        }
        **/        
        GetPerson:{
            type:PersonType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                
                for(let i = 0;i < people.length;i++){
                    if(people[i].id == args.id){
                        return people[i];
                    }
                }

            }
        },
        /*graphql query
        {
            GetPeople
            {
                id,
                name,
                age
            }
        }
        **/
        GetPeople:{
            type: new GraphQLList(PersonType),
            resolve(parentValue, args){
                 return people;
            }
        }
    }
});

const OperationQuery = new GraphQLObjectType({
    name:'OperationQuery',
    fields:{
        /*
        mutation{
            AddPerson(id:"4", name: "view sonice", age: 23){
                name,
                age
            }
        }
        **/
        AddPerson:{
            type:PersonType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/people', {
                    name:args.name,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        /*
        mutation{
            DeletePerson(id:53){
                name,
                age
            }
        }
        **/
        DeletePerson:{
            type:PersonType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/people/'+args.id)
                .then(res => res.data);
            }
        },
        /* 
        mutation{
            EditPerson(id:"2", name: "Stephen Curry"){
                name
            }
        }        
        **/
        EditPerson:{
            type:PersonType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/people/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: GetQuery, 
    mutation:OperationQuery
});