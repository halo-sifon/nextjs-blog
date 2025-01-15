export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className=" rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
