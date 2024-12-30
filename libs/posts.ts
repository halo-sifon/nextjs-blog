import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  category: string;
}

// 统一处理 slug 的函数
function normalizeSlug(slug: string) {
  // 将 Windows 路径分隔符替换为 URL 分隔符
  return slug.split(path.sep).join('/');
}

export function getAllPosts() {
  const allPosts: Post[] = [];

  // 递归读取所有文章
  function readPostsRecursively(dir: string, baseSlug: string = "") {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // 如果是目录，递归读取
        readPostsRecursively(filePath, path.join(baseSlug, file));
      } else if (file.endsWith(".md")) {
        // 如果是 markdown 文件
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);
        const slug = normalizeSlug(path.join(baseSlug, file.replace(/\.md$/, "")));

        allPosts.push({
          slug,
          title: data.title,
          date: data.date,
          content,
          category: data.category,
        });
      }
    });
  }

  readPostsRecursively(postsDirectory);

  // 按日期排序
  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string) {
  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug);
  const normalizedSlug = normalizeSlug(decodedSlug);
  
  // 尝试不同的文件路径组合
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

  return {
    slug: normalizedSlug,
    title: data.title,
    date: data.date,
    content,
    category: data.category,
  };
} 