export interface Circle{
  id: string;
  name: string;
  description: string;
  type: "university" | "amateur";
  tags?: string[];
  membersCount?: number;
  location?: string;
  activeDays?: string[];
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  chats?: Chat[];
}

export interface User {
  id: string;
  name: string;
  gender: "male" | "female";
  age: number;
  type: "student" | "professional";
  interests?: string[];
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat{
  id: string;
  circleId: string;
  userId: string;
  messages?: Message[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Message{
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  readStatus: boolean;
  createdAt?: string;
  updatedAt?: string;
}