'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CircleFormData {
  name: string;
  description: string;
  type: 'university' | 'amateur';
  tags: string[];
  location: string;
  activeDays: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  type?: string;
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
  const [customTag, setCustomTag] = useState('');
  
  const [formData, setFormData] = useState<CircleFormData>({
    name: '',
    description: '',
    type: 'university',
    tags: [],
    location: '',
    activeDays: []
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'サークル名は必須です';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'サークル名は2文字以上で入力してください';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'サークル名は50文字以内で入力してください';
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = '説明は10文字以上で入力してください';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = '説明は500文字以内で入力してください';
    }

    if (!formData.type) {
      newErrors.type = 'サークルタイプを選択してください';
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
      const ownerId = 'owner-001'; // サンプルユーザーID

      const response = await fetch('/api/mock/circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ownerId
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

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAddCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleActiveDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      activeDays: prev.activeDays.includes(day)
        ? prev.activeDays.filter(d => d !== day)
        : [...prev.activeDays, day]
    }));
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="サークル名"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* サークルタイプ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サークルタイプ <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="university"
                    checked={formData.type === 'university'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'university' | 'amateur' }))}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <span className="text-gray-800">大学サークル</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="amateur"
                    checked={formData.type === 'amateur'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'university' | 'amateur' }))}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <span className="text-gray-800">一般愛好会</span>
                </label>
              </div>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full text-gray-700 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="サークルの活動内容や雰囲気を説明してください..."
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/500文字
              </p>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* 活動場所 */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                活動場所
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="例: 〇〇市、××大学△△キャンパス"
                disabled={isLoading}
              />
            </div>

            {/* 活動日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活動日
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activeDays.includes(day)}
                      onChange={() => handleActiveDayToggle(day)}
                      className="mr-2"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-800">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              
              {/* 選択されたタグ */}
              {formData.tags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          disabled={isLoading}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 人気タグ */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">人気のタグ:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                      disabled={isLoading || (formData.tags.length >= 10 && !formData.tags.includes(tag))}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* カスタムタグ追加 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="カスタムタグを追加..."
                  disabled={isLoading || formData.tags.length >= 10}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                  disabled={!customTag.trim() || formData.tags.includes(customTag.trim()) || formData.tags.length >= 10 || isLoading}
                >
                  追加
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                最大10個まで選択できます ({formData.tags.length}/10)
              </p>
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
