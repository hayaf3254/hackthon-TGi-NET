'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAuthSession } from '@/lib/auth';

interface Circle {
  circle_id: number;
  circle_name: string;
  text: string;
  user_id: string;
  type: "university" | "professional";
  created_at?: string;
  updated_at?: string;
}

interface Application {
  application_id: number;
  circle_id: number;
  user_owner_id: string;
  user_appliment_id: string;
  auth: boolean;
  user_name?: string;
  created_at?: string;
}

export default function CircleOwnerDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [ownedCircles, setOwnedCircles] = useState<Circle[]>([]);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // サーバーURL設定
  const SERVER_URL ='http://localhost:3001';

  // クライアントサイドでの認証チェック
  useEffect(() => {
    setIsClient(true);
    
    const session = getAuthSession();
    if (!session) {
      router.push("/signin");
      return;
    }
    
    const user = getCurrentUser();
    const userId = user;
    setCurrentUserId(userId);
    setIsAuthenticated(true);
  }, [router]);

  // オーナーのサークル一覧を取得
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) return;

    const fetchOwnedCircles = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${SERVER_URL}/api/circle`);
        const data = await response.json();

        const owned = data.filter((circle: Circle) => circle.user_id === currentUserId);
        setOwnedCircles(owned);

      } catch (error) {
        console.error("サークル取得エラー:", error);
        setOwnedCircles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedCircles();
  }, [isAuthenticated, currentUserId, SERVER_URL]);

  // 選択されたサークルの参加申請一覧を取得
  useEffect(() => {
    if (ownedCircles.length === 0) return;
    
    const selectedCircle = ownedCircles[selectedCircleIndex];
    if (!selectedCircle) return;

    const fetchApplications = async () => {
      try {
        setApplicationsLoading(true);
        
        // モックデータ - 実際のAPIが実装されるまで使用
        const mockApplications: Application[] = [
          {
            application_id: 1,
            circle_id: selectedCircle.circle_id,
            user_owner_id: currentUserId!,
            user_appliment_id: "101",
            auth: false,
            user_name: "田中太郎",
            created_at: "2024-10-01T14:30:00Z"
          },
          {
            application_id: 2,
            circle_id: selectedCircle.circle_id,
            user_owner_id: currentUserId!,
            user_appliment_id: "102",
            auth: false,
            user_name: "佐藤花子",
            created_at: "2024-10-02T09:15:00Z"
          },
          {
            application_id: 3,
            circle_id: selectedCircle.circle_id,
            user_owner_id: currentUserId!,
            user_appliment_id: "103",
            auth: true,
            user_name: "鈴木一郎",
            created_at: "2024-09-28T16:45:00Z"
          }
        ];
        
        // 実際のAPI呼び出し（コメントアウト）
        // const response = await fetch(`${SERVER_URL}/circle/${selectedCircle.circle_id}/applications`);
        // if (response.ok) {
        //   const data = await response.json();
        //   setApplications(data);
        // } else {
        //   setApplications(mockApplications);
        // }
        
        setApplications(mockApplications);
        
      } catch (error) {
        console.error("参加申請取得エラー:", error);
        setApplications([]);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, [ownedCircles, selectedCircleIndex, currentUserId, SERVER_URL]);

  const handleApproveApplication = async (applicationId: number) => {
    try {
      // 実際のAPI呼び出し（コメントアウト）
      // const response = await fetch(`${SERVER_URL}/applications/${applicationId}/approve`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // if (response.ok) {
      //   setApplications(prev => prev.map(app => 
      //     app.application_id === applicationId 
      //       ? { ...app, auth: true }
      //       : app
      //   ));
      //   alert('参加を承認しました');
      // }
      
      // モック処理
      setApplications(prev => prev.map(app => 
        app.application_id === applicationId 
          ? { ...app, auth: true }
          : app
      ));
      alert('参加を承認しました');
      
    } catch (error) {
      console.error("承認エラー:", error);
      alert('承認に失敗しました');
    }
  };

  const handleRejectApplication = async (applicationId: number) => {
    try {
      // 実際のAPI呼び出し（コメントアウト）
      // const response = await fetch(`${SERVER_URL}/applications/${applicationId}`, {
      //   method: 'DELETE'
      // });
      
      // if (response.ok) {
      //   setApplications(prev => prev.filter(app => app.application_id !== applicationId));
      //   alert('参加申請を拒否しました');
      // }
      
      // モック処理
      setApplications(prev => prev.filter(app => app.application_id !== applicationId));
      alert('参加申請を拒否しました');
      
    } catch (error) {
      console.error("拒否エラー:", error);
      alert('拒否に失敗しました');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // クライアントサイドでの初期化が完了するまでローディング表示
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合は何も表示しない
  if (!isAuthenticated) {
    return null;
  }

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">サークル情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // サークルを所有していない場合
  if (ownedCircles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">所有しているサークルがありません</h2>
            <p className="text-gray-600 mb-8">サークルを作成してメンバーを管理しましょう。</p>
            <button
              onClick={() => router.push('/circle')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              サークルを作成
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCircle = ownedCircles[selectedCircleIndex];
  const pendingApplications = applications.filter(app => !app.auth);
  const approvedApplications = applications.filter(app => app.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">サークル管理ダッシュボード</h1>
          <p className="text-gray-600">あなたが管理しているサークルの詳細と参加申請を確認できます。</p>
        </div>

        {/* サークルタブ */}
        {ownedCircles.length > 1 && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {ownedCircles.map((circle, index) => (
                  <button
                    key={circle.circle_id}
                    onClick={() => setSelectedCircleIndex(index)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      index === selectedCircleIndex
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {circle.circle_name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* サークル詳細 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">サークル詳細</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedCircle.circle_name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedCircle.type === "university"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {selectedCircle.type === "university" ? "大学サークル" : "社会人サークル"}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">説明</h4>
                <p className="text-gray-600 leading-relaxed">{selectedCircle.text}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">作成日</p>
                  <p className="font-medium">{formatDate(selectedCircle.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">更新日</p>
                  <p className="font-medium">{formatDate(selectedCircle.updated_at)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">承認済み参加者</p>
                  <p className="text-2xl font-bold text-green-600">{approvedApplications.length}人</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">申請待ち</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingApplications.length}人</p>
                </div>
              </div>
            </div>
          </div>

          {/* 参加申請一覧 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">参加申請一覧</h2>
            
            {applicationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">参加申請はありません</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* 申請待ち */}
                {pendingApplications.length > 0 && (
                  <div>
                    <h3 className="font-medium text-orange-700 mb-3">申請待ち ({pendingApplications.length}件)</h3>
                    {pendingApplications.map((application) => (
                      <div key={application.application_id} className="border border-orange-200 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{application.user_name || `ユーザーID: ${application.user_appliment_id}`}</h4>
                            <p className="text-sm text-gray-500">申請日: {formatDate(application.created_at)}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApproveApplication(application.application_id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              承認
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application.application_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              拒否
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 承認済み */}
                {approvedApplications.length > 0 && (
                  <div>
                    <h3 className="font-medium text-green-700 mb-3">承認済み ({approvedApplications.length}件)</h3>
                    {approvedApplications.map((application) => (
                      <div key={application.application_id} className="border border-green-200 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{application.user_name || `ユーザーID: ${application.user_appliment_id}`}</h4>
                            <p className="text-sm text-gray-500">申請日: {formatDate(application.created_at)}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            承認済み
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
