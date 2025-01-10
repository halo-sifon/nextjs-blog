import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">关于我</h1>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-48 h-48 relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/avatar.png"
              alt="Profile picture"
              fill
              priority
              loading="eager"
              className="object-cover"
            />
          </div>

          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-4">ShengHao Chen</h2>
            <p className="text-gray-600 mb-4">前端开发工程师</p>

            <div className="space-y-4">
              <p>
                Halo！ 我是 ShengHao
                Chen，一名充满热情的6年纯前端开发工程师，喜欢折腾，爱好分享，热爱开源
                。
              </p>

              <h3 className="text-xl font-semibold mt-6">Skills</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>前端: React, Next.js, TypeScript, Tailwind CSS</li>
                <li>后端: Node.js, Express, Mysql</li>
                <li>工具: Git, Docker</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Contact</h3>
              <p>
                Email:{" "}
                <a
                  href="mailto:chenshenghao@163.com"
                  className=" text-blue-500 hover:underline"
                >
                  chenshenghao@163.com
                </a>
                <br />
                GitHub:{" "}
                <a
                  href="https://github.com/halo-sifon"
                  className=" text-blue-500 hover:underline"
                  target="_blank"
                >
                  github.com/halo-sifon
                </a>
                <br />
                WeChat: halo_sifon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
