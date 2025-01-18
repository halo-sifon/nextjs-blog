import { Loading } from "@/components/ui/loading";

export default function PostsLoading() {
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-[70vh] flex items-center justify-center">
      <Loading className="scale-150" text="" />
    </div>
  );
}
