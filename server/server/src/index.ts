import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

const MONGODB_URI =
  "mongodb+srv://root:root@cluster0.zdjpvlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    // await mongoose.connection.db.dropDatabase();

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        headers: req.headers,
      };
    },
  });
  await server.start();

  const app = express() as any;
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: ${server.graphqlPath}`);
  });
}

async function main() {
  await connectToDatabase();
  await startApolloServer();
}

main().catch((err) => {
  console.error("Error starting the server:", err);
});
