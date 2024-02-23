import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { RESTDataSource } from '@apollo/datasource-rest';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLError } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config'
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { users } from './fakeDb.js';
import jwt from 'jsonwebtoken';


const PORT = 4000;

class WeatherAPI extends RESTDataSource {
  override baseURL = 'http://api.weatherapi.com/';

  async getWeather() {
    const data = await this.get(`v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=London&days=2&aqi=no&alerts=no`);
    return data
  };
};


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const httpServer = createServer(app);

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);


const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server, {
  context: async ({ req }) => {
    const { cache } = server;
    const token = req.headers.authorization || '';

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = users.find(user => user.id === decoded.userId);

        return {
          user,
          dataSources: {
            weatherAPI: new WeatherAPI({ cache }),
          },

        };
      } catch (error) {
        throw new GraphQLError('Invalid token');
      }
    }

  },
}));

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});
