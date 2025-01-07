import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

export const DB_NAME = 'blog';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // 在开发环境中使用全局变量来避免热重载时创建多个连接
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 在生产环境中为每个请求创建新的连接
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 