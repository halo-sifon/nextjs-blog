import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  connectTimeoutMS: 30000,     // 连接超时时间，增加到 30 秒
  socketTimeoutMS: 45000,      // Socket 超时时间
  serverSelectionTimeoutMS: 60000, // 服务器选择超时时间
  maxPoolSize: 10,             // 连接池大小
  retryWrites: true,           // 启用重试写入
  retryReads: true,            // 启用重试读取
  w: 'majority',               // 写入确认级别
};

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
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(error => {
        console.error('MongoDB 连接错误:', error);
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 在生产环境中为每个请求创建新的连接
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(error => {
      console.error('MongoDB 连接错误:', error);
      throw error;
    });
}

// 添加连接状态检查
clientPromise.then(client => {
  client.on('close', () => {
    console.warn('MongoDB 连接已关闭');
  });
  
  client.on('reconnect', () => {
    console.log('MongoDB 重新连接成功');
  });
}).catch(error => {
  console.error('MongoDB 连接监听器设置失败:', error);
});

export default clientPromise; 