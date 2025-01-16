export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center bg-background">
      {children}
    </div>
  );
}
