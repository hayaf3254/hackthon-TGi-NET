"use client";
import { getAuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Circle {
  id: number;
  name: string;
  description: string;
  type: "university" | "professional";
}

const circles: Circle[] = [
  {
    id: 1,
    name: "東京大学テニスサークル",
    description:
      "週2回のコートでの練習と月1回の大会参加。初心者から上級者まで楽しく活動しています。年間を通して合宿やイベントも開催。",
    type: "university",
  },
  {
    id: 2,
    name: "社会人フットサルクラブ TOKYO FC",
    description:
      "平日夜と土日にフットサルを楽しむ社会人サークル。チームワークを大切にしながら、健康維持と交流を目的に活動中。",
    type: "professional",
  },
  {
    id: 3,
    name: "早稲田大学写真研究会",
    description:
      "街歩き撮影会や展示会の開催を通じて写真技術を磨く大学サークル。デジタル・フィルム問わず、様々な写真表現を学べます。",
    type: "university",
  },
  {
    id: 4,
    name: "渋谷読書会",
    description:
      "月2回、カフェで本について語り合う社会人の読書サークル。ジャンルは問わず、新しい本との出会いと知的な交流を楽しんでいます。",
    type: "professional",
  },
  {
    id: 5,
    name: "慶應大学軽音楽サークル",
    description:
      "バンド活動を中心とした音楽サークル。定期ライブやコンテストへの参加を通じて、音楽スキルの向上と仲間との絆を深めています。",
    type: "university",
  },
  {
    id: 6,
    name: "Tokyo Hiking Club",
    description:
      "関東近郊の山々をハイキングする社会人サークル。自然を楽しみながら健康づくりと仲間作りを目指しています。初心者歓迎。",
    type: "professional",
  },
];

export default function Home() {
  const router = useRouter();
  const session = getAuthSession();
  if (!session) {
    router.push("/signin");
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-b-xl">
            <h1 className="text-white font-bold text-2xl mb-4 flex">
              Circle Connect
            </h1>
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2"></div>
            </div>
          </div>
        </header>

        <main>
          <div className="space-y-6">
            {circles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <img
                    src={`/icons/circle${circle.id}.png`}
                    alt={`${circle.name} Icon`}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {circle.name}
                      </h2>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          circle.type === "university"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {circle.type === "university" ? "大学" : "社会人"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {circle.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    参加申請
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    連絡する
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
