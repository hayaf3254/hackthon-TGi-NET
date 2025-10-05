// ローカルストレージを使用したセッション管理ユーティリティ

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  type: "student" | "professional";
}

export interface AuthSession {
  user_id: string;
  name: string;
}

const AUTH_STORAGE_KEY = 'tgi_net_auth_session';

// セッションをローカルストレージに保存
export const saveAuthSession = (user_id: string, name: string): void => {
  try {
    const session: AuthSession = {
      user_id,
      name,
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    // デバッグ用ログ
    console.log('Auth session saved:', {
      userId: user_id,
      username: name,
    });
  } catch (error) {
    console.error('Failed to save auth session:', error);
  }
};

// ローカルストレージからセッションを取得
export const getAuthSession = (): AuthSession | null => {
  try {
    if (typeof window === 'undefined') {
      return null; // SSR環境では null を返す
    }

    const sessionData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!sessionData) {
      return null;
    }

    const session: AuthSession = JSON.parse(sessionData);

    return session;
  } catch (error) {
    console.error('Failed to get auth session:', error);
    removeAuthSession(); // 破損したセッションデータを削除
    return null;
  }
};

// 現在のユーザー情報を取得
export const getCurrentUser = (): string | null => {
  const session = getAuthSession();
  return session?.user_id || null;
};

// ユーザーが認証されているかチェック
export const isAuthenticated = (): boolean => {
  return getAuthSession() !== null;
};

// セッションをローカルストレージから削除
export const removeAuthSession = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('Auth session removed');
  } catch (error) {
    console.error('Failed to remove auth session:', error);
  }
};