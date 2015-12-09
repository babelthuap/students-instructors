import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';


// seed our pretend database
let links = [
  {_id: 1, title: "Google", url: "https://google.com"},
  {_id: 2, title: "XKCD", url: "xkcd.com"},
  {_id: 3, title: "GitHub", url: "github.com"},
  {_id: 4, title: "Yahoo", url: "yahoo.com"},
  {_id: 5, title: "React", url: "https://facebook.github.io/react"},
  {_id: 6, title: "GraphQL", url: "http://graphql.org"}
];


let linkType = new GraphQLObjectType({
  name: 'Links',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    title: {
      type: GraphQLString,
      args: {
        upcase: {type: GraphQLBoolean}
      },
      resolve: (obj, {upcase}) => upcase ? obj.title.toUpperCase() : obj.title
    },
    url: {
      type: GraphQLString,
      resolve: obj => {
        let url = obj.url;
        return url.startsWith('http') ? url : `http://${url}`
      }
    },
    safe: {
      type: GraphQLBoolean,
      resolve: obj => obj.url.startsWith('https')
    }
  })
})


let counter = 0;
let schema = new GraphQLSchema({
  
  // top level fields
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      counter: {
        type: GraphQLInt,
        resolve: () => counter
      },

      square: {
        type: GraphQLInt,
        args: {
          n: {type: GraphQLInt}
        },
        resolve: (_, {n}) => n * n
      },

      answer: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: () => 42
      },

      links: {
        type: new GraphQLList(linkType),
        args: {
          first: {type: new GraphQLNonNull(GraphQLInt)}
        },
        resolve: (_, {first}) => links.slice(0, first)
      },

      allLinks: {
        type: new GraphQLList(linkType),
        resolve: () => links
      }
    })
  }),

  // mutation (writes)
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      incrementCounter: {
        type: GraphQLInt,
        args: {
          delta: {type: GraphQLInt}
        },
        resolve: (_, {delta}) => counter += delta
      },

      createLink: {
        type: linkType,
        args: {
          title: {type: GraphQLString},
          url: {type: GraphQLString}
        },
        resolve: (_, {title, url}) => {
          var newLink = {id: Date.now(), title: title, url: url}
          links.push(newLink);
          return newLink;
        }
      }

    })
  })
});


export default schema;




























