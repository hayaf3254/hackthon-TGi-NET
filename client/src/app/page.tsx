"use client";
import { getAuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Circle {
  circle_id: number;
  circle_name: string;
  text: string;
  user_id:number;
  type: "university" | "professional";
}


export default function Home() {
  const router = useRouter();
  const session = getAuthSession();
  const [circleList, setCircleList] = useState<Circle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  if (!session) {
    router.push("/signin");
  }
  }, []);

  useEffect(() => {
  const fetchCircles = async () => {
    // APIからサークルデータを取得する例
    const response = await fetch("http://localhost:3001/api/circle");
    const data = await response.json();
    console.log("Fetched circles:", data); // デバッグ用ログ
    setCircleList(data);
  }

  fetchCircles();
}, []);

  const handleCreateCircle = () => {
    router.push("/circle");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-b-xl flex justify-between top-0">
            <h1 className="text-white font-bold text-2xl mb-4 flex">
              Circle Connect
            </h1>
              <button
                onClick={handleCreateCircle}
                className="mt-6 bg-white hover:bg-indigo-400 text-indigo-600 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                サークルを作成
              </button>
          </div>
        </header>

        <main>
          <div className="space-y-6">
            {circleList.map((circle) => (
              <div
                key={circle.circle_id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <img
                    src={`/icons/circle${circle.circle_id}.png`}
                    alt={`${circle.circle_name} Icon`}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {circle.circle_name}
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
                      {circle.text}
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
