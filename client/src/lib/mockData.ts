import { Circle, Chat, Message } from "@/types";
import { faker } from "@faker-js/faker";

// 一貫性のあるデータ生成のためにシード値を設定
faker.seed(12345);

// 固定のサークル代表者とユーザーIDを生成（テスト用）
export const SAMPLE_CIRCLE_OWNER_ID = "owner-001";
export const SAMPLE_USER_IDS = [
  "user-001", "user-002", "user-003", "user-004", "user-005"
];

// 実用的なサークルタグ
const REALISTIC_TAGS = [
  "スポーツ", "音楽", "アート", "テクノロジー", "プログラミング",
  "読書", "料理", "映画", "ゲーム", "写真", "旅行", "語学",
  "ダンス", "アウトドア", "ボランティア", "起業", "投資", "健康"
];

// よりリアルなサークル名のプレフィックス
const CIRCLE_PREFIXES = [
  "東京大学", "早稲田大学", "慶應大学", "明治大学", "青山学院大学",
  "立教大学", "中央大学", "法政大学", "上智大学", "筑波大学"
];

const CIRCLE_TYPES = [
  "テニスサークル", "フットサルサークル", "バスケサークル", "軽音サークル",
  "写真サークル", "演劇サークル", "プログラミングサークル", "英語サークル",
  "料理サークル", "ダンスサークル", "映画研究サークル", "読書サークル"
];

// サークルデータを生成（より現実的な内容）
export const mockCircles: Circle[] = Array.from({ length: 20 }, (_, index) => {
  const prefix = faker.helpers.arrayElement(CIRCLE_PREFIXES);
  const type = faker.helpers.arrayElement(CIRCLE_TYPES);
  const isUniversity = Math.random() > 0.3; // 70%が大学サークル
  
  return {
    id: `circle-${String(index + 1).padStart(3, '0')}`, // 一貫性のあるID
    name: isUniversity ? `${prefix} ${type}` : `${type} 愛好会`,
    description: faker.lorem.sentences(2),
    type: isUniversity ? "university" : "amateur",
    tags: faker.helpers.arrayElements(REALISTIC_TAGS, { min: 2, max: 4 }),
    membersCount: faker.number.int({ min: 8, max: 50 }),
    location: faker.location.city(),
    activeDays: faker.helpers.arrayElements(
      ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"], 
      { min: 1, max: 3 }
    ),
    ownerId: index === 0 ? SAMPLE_CIRCLE_OWNER_ID : faker.string.uuid(),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    chats: [], // 動的に管理
  };
});

// 効率的なデータ管理のための統一ストレージ
class ChatStorage {
  private storage: Map<string, Map<string, Chat>> = new Map();
  private chatIndex: Map<string, string> = new Map(); // chatId -> circleId のインデックス

  // サークルのチャット一覧を取得
  getCircleChats(circleId: string): Chat[] {
    const circleChats = this.storage.get(circleId);
    return circleChats ? Array.from(circleChats.values()) : [];
  }

  // 特定ユーザーとのチャットを検索
  findChatByUser(circleId: string, userId: string): Chat | undefined {
    const circleChats = this.storage.get(circleId);
    return circleChats?.get(userId);
  }

  // チャットIDからチャットを検索
  findChatById(chatId: string): Chat | undefined {
    const circleId = this.chatIndex.get(chatId);
    if (!circleId) return undefined;
    
    const circleChats = this.storage.get(circleId);
    if (!circleChats) return undefined;
    
    for (const chat of circleChats.values()) {
      if (chat.id === chatId) return chat;
    }
    return undefined;
  }

  // 新しいチャットを作成
  createChat(circleId: string, userId: string, initialMessage?: Message): Chat {
    const chatId = `chat-${Date.now()}-${faker.string.alphanumeric(6)}`;
    const now = new Date().toISOString();
    
    const newChat: Chat = {
      id: chatId,
      circleId,
      userId,
      messages: initialMessage ? [{ ...initialMessage, chatId }] : [],
      createdAt: now,
      updatedAt: now,
    };

    // ストレージに保存
    if (!this.storage.has(circleId)) {
      this.storage.set(circleId, new Map());
    }
    this.storage.get(circleId)!.set(userId, newChat);
    this.chatIndex.set(chatId, circleId);

    return newChat;
  }

  // メッセージを追加
  addMessage(chatId: string, message: Message): Chat | null {
    const chat = this.findChatById(chatId);
    if (!chat) return null;

    const messageWithChatId = { ...message, chatId };
    chat.messages = chat.messages || [];
    chat.messages.push(messageWithChatId);
    chat.updatedAt = new Date().toISOString();

    return chat;
  }

  // デバッグ用：全データの概要を取得
  getStorageInfo() {
    const totalCircles = this.storage.size;
    let totalChats = 0;
    let totalMessages = 0;

    for (const circleChats of this.storage.values()) {
      totalChats += circleChats.size;
      for (const chat of circleChats.values()) {
        totalMessages += chat.messages?.length || 0;
      }
    }

    return { totalCircles, totalChats, totalMessages };
  }
}

// グローバルなチャットストレージインスタンス
const chatStorage = new ChatStorage();

// パブリック API関数（既存のAPI実装と互換性を保つ）
export const getCircleChats = (circleId: string): Chat[] => {
  return chatStorage.getCircleChats(circleId);
};

export const findChatByUserAndCircle = (circleId: string, userId: string): Chat | undefined => {
  return chatStorage.findChatByUser(circleId, userId);
};

export const createChat = (circleId: string, userId: string, initialMessage?: Message): Chat => {
  return chatStorage.createChat(circleId, userId, initialMessage);
};

export const addMessageToChat = (chatId: string, message: Message): Chat | null => {
  return chatStorage.addMessage(chatId, message);
};

export const findCircleById = (circleId: string): Circle | undefined => {
  return mockCircles.find(circle => circle.id === circleId);
};

// 便利なヘルパー関数
export const getCirclesByType = (type: "university" | "amateur"): Circle[] => {
  return mockCircles.filter(circle => circle.type === type);
};

export const getCirclesByTag = (tag: string): Circle[] => {
  return mockCircles.filter(circle => 
    circle.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

export const getStorageStats = () => {
  return chatStorage.getStorageInfo();
};

// 開発用：サンプルデータの初期化
export const initializeSampleData = () => {
  // サンプルのチャットデータを作成
  if (mockCircles.length > 0) {
    const firstCircle = mockCircles[0];
    
    // サンプルユーザーからの参加申請
    SAMPLE_USER_IDS.slice(0, 2).forEach((userId, index) => {
      const joinMessage: Message = {
        id: `msg-${Date.now()}-${index}`,
        chatId: "",
        senderId: userId,
        content: `ユーザー${index + 1}さんがサークルに参加を希望しています。`,
        timestamp: new Date(Date.now() - (index * 60000)).toISOString(),
        readStatus: false,
        createdAt: new Date(Date.now() - (index * 60000)).toISOString(),
        updatedAt: new Date(Date.now() - (index * 60000)).toISOString(),
      };

      createChat(firstCircle.id, userId, joinMessage);
    });
  }
};
