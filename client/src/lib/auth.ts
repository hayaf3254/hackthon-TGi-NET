// ローカルストレージを使用したセッション管理ユーティリティ

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  type: "student" | "professional";
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number; // タイムスタンプ（ミリ秒）
}

const AUTH_STORAGE_KEY = 'tgi_net_auth_session';

// セッションをローカルストレージに保存
export const saveAuthSession = (user: AuthUser, token: string, expiresIn: number): void => {
  try {
    const session: AuthSession = {
      user,
      token,
      expiresAt: Date.now() + expiresIn
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    // デバッグ用ログ
    console.log('Auth session saved:', {
      userId: user.id,
      username: user.username,
      expiresAt: new Date(session.expiresAt).toISOString()
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
    
    // セッションの有効期限をチェック
    if (Date.now() >= session.expiresAt) {
      removeAuthSession(); // 期限切れのセッションを削除
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to get auth session:', error);
    removeAuthSession(); // 破損したセッションデータを削除
    return null;
  }
};

// 現在のユーザー情報を取得
export const getCurrentUser = (): AuthUser | null => {
  const session = getAuthSession();
  return session?.user || null;
};

// 現在のユーザーIDを取得
export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user?.id || null;
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

// セッションの有効期限を延長
export const refreshAuthSession = (additionalTime: number = 24 * 60 * 60 * 1000): boolean => {
  try {
    const session = getAuthSession();
    if (!session) {
      return false;
    }

    session.expiresAt = Date.now() + additionalTime;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    
    console.log('Auth session refreshed:', {
      userId: session.user.id,
      newExpiresAt: new Date(session.expiresAt).toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Failed to refresh auth session:', error);
    return false;
  }
};

// セッションの残り時間を取得（ミリ秒）
export const getSessionTimeRemaining = (): number => {
  const session = getAuthSession();
  if (!session) {
    return 0;
  }
  
  return Math.max(0, session.expiresAt - Date.now());
};

// セッションの残り時間を人間が読める形式で取得
export const getSessionTimeRemainingFormatted = (): string => {
  const timeRemaining = getSessionTimeRemaining();
  
  if (timeRemaining === 0) {
    return 'セッション期限切れ';
  }
  
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  } else {
    return `${minutes}分`;
  }
};

// 開発用：セッション情報をコンソールに出力
export const debugAuthSession = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const session = getAuthSession();
    console.log('=== Auth Session Debug ===');
    console.log('Session exists:', !!session);
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('Username:', session.user.username);
      console.log('Name:', session.user.name);
      console.log('Type:', session.user.type);
      console.log('Token:', session.token);
      console.log('Expires at:', new Date(session.expiresAt).toISOString());
      console.log('Time remaining:', getSessionTimeRemainingFormatted());
    }
    console.log('========================');
  }
};