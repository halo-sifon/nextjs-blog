import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getCache, setCache } from './cache';

const postsDirectory = path.join(process.cwd(), '_posts');

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

// 获取所有文章但不包含内容
async function getAllPostsWithoutContent() {
  // 尝试从缓存获取
  const cacheKey = 'posts:list';
  const cachedPosts = await getCache<Omit<Post, 'content'>[]>(cacheKey);
  
  if (cachedPosts) {
    return cachedPosts;
  }

  const allPosts: Omit<Post, 'content'>[] = [];

  function readPostsRecursively(dir: string, baseSlug: string = "") {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        readPostsRecursively(filePath, path.join(baseSlug, file));
      } else if (file.endsWith(".md")) {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const slug = normalizeSlug(path.join(baseSlug, file.replace(/\.md$/, "")));

        allPosts.push({
          slug,
          title: data.title,
          date: data.date,
          category: data.category,
        });
      }
    });
  }

  readPostsRecursively(postsDirectory);
  const sortedPosts = allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
  
  // 存入缓存
  await setCache(cacheKey, sortedPosts);
  
  return sortedPosts;
}

export async function getPaginatedPosts(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedPosts> {
  const cacheKey = `posts:paginated:${page}:${limit}:${search || 'all'}`;
  const cachedResult = await getCache<PaginatedPosts>(cacheKey, {
    revalidate: 3600 // 1小时重新验证一次
  });

  if (cachedResult) {
    return cachedResult;
  }

  const allPosts = await getAllPostsWithoutContent();
  let filteredPosts = allPosts;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.category.toLowerCase().includes(searchLower)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const result = {
    posts: paginatedPosts.map(post => ({
      ...post,
      content: '', // 分页列表不需要返回内容
    })),
    total: filteredPosts.length,
    hasMore: endIndex < filteredPosts.length,
  };

  // 存入缓存
  await setCache(cacheKey, result);

  return result;
}

export async function getPostBySlug(slug: string) {
  const cacheKey = `post:${slug}`;
  const cachedPost = await getCache<Post>(cacheKey);

  if (cachedPost) {
    return cachedPost;
  }

  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = normalizeSlug(decodedSlug);
  
  const possiblePaths = [
    path.join(postsDirectory, `${normalizedSlug}.md`),
    path.join(postsDirectory, normalizedSlug, "index.md"),
  ];

  let filePath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const post = {
    slug: normalizedSlug,
    title: data.title,
    date: data.date,
    content,
    category: data.category,
  };

  // 存入缓存
  await setCache(cacheKey, post);

  return post;
} 