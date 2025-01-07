import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import clientPromise, { DB_NAME } from './mongodb';
import { WithId, Document } from 'mongodb';

const postsDirectory = path.join(process.cwd(), '_posts');
const COLLECTION_NAME = 'posts';

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  category: string;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

// 统一处理 slug 的函数
function normalizeSlug(slug: string) {
  return slug.split(path.sep).join('/');
}

// 转换MongoDB文档为Post对象
function convertToPost(doc: WithId<Document>): Post {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...post } = doc;
  return post as Post;
}

// 从Markdown文件读取文章
function readPostFromFile(filePath: string, baseSlug: string = ""): Post {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const slug = normalizeSlug(path.join(baseSlug, path.basename(filePath).replace(/\.md$/, "")));

  return {
    slug,
    title: data.title,
    date: data.date,
    content,
    category: data.category,
  };
}

// 同步单个文章到MongoDB
async function syncPostToMongoDB(post: Post) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  await collection.updateOne(
    { slug: post.slug },
    { $set: post },
    { upsert: true }
  );
}

// 确保文章存在于MongoDB中并同步更新
async function ensurePostsInMongoDB() {
  function readPostsRecursively(dir: string, baseSlug: string = "") {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        readPostsRecursively(filePath, path.join(baseSlug, file));
      } else if (file.endsWith(".md")) {
        const post = readPostFromFile(filePath, baseSlug);
        syncPostToMongoDB(post).catch(console.error);
      }
    });
  }

  readPostsRecursively(postsDirectory);
}

export async function getPaginatedPosts(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedPosts> {
  await ensurePostsInMongoDB();
  
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  // 构建查询条件
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  // 获取总数
  const total = await collection.countDocuments(query);

  // 获取分页数据
  const docs = await collection
    .find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .project<WithId<Document>>({ content: 0 }) // 不返回content字段
    .toArray();

  // 转换文档
  const posts = docs.map(convertToPost);

  return {
    posts,
    total,
    hasMore: (page * limit) < total,
  };
}

export async function getPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = normalizeSlug(decodedSlug);

  // 尝试从文件系统读取最新内容
  const categoryDirs = fs.readdirSync(postsDirectory);
  let post: Post | null = null;

  for (const dir of categoryDirs) {
    const categoryPath = path.join(postsDirectory, dir);
    if (fs.statSync(categoryPath).isDirectory()) {
      const possiblePath = path.join(categoryPath, `${path.basename(normalizedSlug)}.md`);
      if (fs.existsSync(possiblePath)) {
        post = readPostFromFile(possiblePath, dir);
        await syncPostToMongoDB(post);
        break;
      }
    }
  }

  if (!post) {
    // 如果文件不存在，从MongoDB读取
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const doc = await collection.findOne<WithId<Document>>({ slug: normalizedSlug });
    if (!doc) return null;
    post = convertToPost(doc);
  }

  return post;
} 