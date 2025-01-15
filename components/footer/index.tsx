export default function Footer() {
  return (
    <footer className="bg-muted mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Sifon&apos;s博客. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href="https://github.com/halo-sifon"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
