export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Sifon's博客. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href="https://github.com/halo-sifon/nextjs-blog"
              className="hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
