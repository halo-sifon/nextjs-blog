export const dynamic = 'force-static';
export const revalidate = false;

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {children}
    </div>
  );
} 