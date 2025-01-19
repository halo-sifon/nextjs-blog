"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface CategorySelectProps {
  categories: Array<{
    _id: string;
    title: string;
    count: number;
  }>;
  currentCategory?: string;
}

export function CategorySelect({ categories, currentCategory }: CategorySelectProps) {
  const router = useRouter();

  return (
    <div className="w-full md:hidden">
      <Select
        value={currentCategory || "all"}
        onValueChange={(value) => {
          router.push(value === "all" ? "/posts" : `/posts?category=${value}`);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">近期文章</SelectItem>
          {categories.map((item) => (
            <SelectItem key={item._id} value={item._id}>
              {item.title} ({item.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 