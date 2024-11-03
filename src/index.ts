import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  
  
  type Book {
    id: String
    title: String
    authorId: String
    publishedYear: Int
    author: Author
  }
  type Author {
    id: String
    name: String
    bookIds: [String]
    books: [Book]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  
  
  type Query {
    books: [Book]
    authors: [Author]
  }
    type Mutation {
        addBook( title: String, publishedYear: Int, authorId: String): Book!
    }
`;
// =========================================================================
 // A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const data = {
  authors: [
    { id: "1", name: "shubham khatik", bookIds: ["101", "102"] },
    { id: "2", name: "Akshay gupta", bookIds: ["103"] },
  ],
  books: [
    { id: "101", title: "System Design", publishedYear: 2000, authorId: "1" },
    { id: "102", title: "frontend", publishedYear: 2010, authorId: "1" },
    { id: "103", title: "ramayana", publishedYear: 2020, authorId: "2" },
  ],
};
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  Book: {
    author: (parent, args, context, info) => {
      return data.authors.find((author) => author.id === parent.authorId);
    },
  },
  Author: {
    books: (parent, args, context, info) => {
      return data.books.filter((book) => book.authorId === parent.id);
    },
  },
  Query: {
    books: () => data.books,
    authors: () => data.authors,
  },
  Mutation: {
    addBook: (parent, args, context, info) => {
        console.log(args);
        const newBook = {...args, id: data.books.length + 1};
        data.books.push(newBook)
        return newBook;
    }
}
};
// ===============================================================================
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);