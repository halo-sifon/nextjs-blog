import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  content: string;
  excerpt: string;
};

export async function getAllPosts(): Promise<Post[]> {
  function getAllFiles(dir: string): string[] {
    const files = fs.readdirSync(dir);
    let fileList: string[] = [];
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fileList = fileList.concat(getAllFiles(filePath));
      } else if (file.endsWith('.md')) {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  }

  const files = getAllFiles(postsDirectory);
  const posts = files.map(filePath => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const relativePath = path.relative(postsDirectory, filePath);
    const slug = relativePath.replace(/\.md$/, '');
    
    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      content,
      excerpt: content.slice(0, 200) + '...'
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // 直接使用 slug 构建完整路径
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      content,
      excerpt: content.slice(0, 200) + '...'
    };
  } catch {
    return null;
  }
} 