import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import { users } from './fakeDb.js';
import jwt from 'jsonwebtoken';


const pubsub = new PubSub();

  

export const resolvers = {
    Query: {
      weather: async (_, { id }, { dataSources, user }) => {
        if (!user) {
          throw new GraphQLError('Unauthorized');
        }
        return await dataSources.weatherAPI.getWeather();
      },
    },
    Mutation: {
      signup: (_, { username, password }) => {
        const user = { id: users.length + 1, username, password };
        users.push(user);
  
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
        pubsub.publish('userAdded', { userAdded: user });
        return { token, user };
      },
      login: (_, { username, password }) => {
        const user = users.find(user => user.username === username && user.password === password);
  
        if (!user) {
          throw new Error('Invalid username or password');
        }
  
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
  
        return { token, user };
      }
    },
    Subscription: {
      userAdded: {
        subscribe: () => pubsub.asyncIterator(['userAdded'])
      }
    }
  };
  