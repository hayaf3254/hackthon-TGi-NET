'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

interface CircleFormData {
  circle_name: string;
  text: string;
}

interface FormErrors {
  circle_name?: string;
  text?: string;
  general?: string;
}

const DAYS_OF_WEEK = [
  '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'
];

const POPULAR_TAGS = [
  'スポーツ', '音楽', 'アート', 'テクノロジー', 'プログラミング',
  '読書', '料理', '映画', 'ゲーム', '写真', '旅行', '語学',
  'ダンス', 'アウトドア', 'ボランティア', '起業', '投資', '健康'
];

export default function CreateCirclePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isClient, setIsClient] = useState(false);
  const session = getAuthSession();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [formData, setFormData] = useState<CircleFormData>({
    circle_name: '',
    text: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.circle_name.trim()) {
      newErrors.circle_name = 'サークル名は必須です';
    } else if (formData.circle_name.trim().length < 2) {
      newErrors.circle_name = 'サークル名は2文字以上で入力してください';
    } else if (formData.circle_name.trim().length > 50) {
      newErrors.circle_name = 'サークル名は50文字以内で入力してください';
    }

    if (!formData.text.trim()) {
      newErrors.text = '説明は必須です';
    } else if (formData.text.trim().length < 10) {
      newErrors.text = '説明は10文字以上で入力してください';
    } else if (formData.text.trim().length > 500) {
      newErrors.text = '説明は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: 実際のアプリケーションでは認証されたユーザーIDを使用
      const user_id = session?.user_id; 

      const response = await fetch('http://localhost:3001/api/circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'サークル作成に失敗しました');
      }

      // 成功時の処理
      alert('サークルが正常に作成されました！');
      router.push('/'); // ホームページにリダイレクト
      
    } catch (error) {
      console.error('Error creating circle:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'サークル作成に失敗しました'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">新しいサークルを作成</h1>
          
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* サークル名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                サークル名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.circle_name}
                onChange={(e) => setFormData(prev => ({ ...prev, circle_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500 ${
                  errors.circle_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="サークル名"
                disabled={isLoading}
              />
              {errors.circle_name && <p className="mt-1 text-sm text-red-600">{errors.circle_name}</p>}
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="text"
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className={`w-full text-gray-700 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${
                  errors.text ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="サークルの活動内容や雰囲気を説明してください..."
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.text.length}/500文字
              </p>
              {errors.text && <p className="mt-1 text-sm text-red-600">{errors.text}</p>}
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '作成中...' : 'サークルを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
