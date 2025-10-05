import { NextRequest, NextResponse } from "next/server";
import { Circle, Chat, Message } from "@/types";
import { findCircleById, createChat, getCircleChats, findChatByUserAndCircle, addMessageToChat } from "@/lib/mockData";
import { faker } from "@faker-js/faker";

//サークル参加申請
export async function POST(request: NextRequest, { params }: { params: { circleId: string } }) {
  try {
    const body = await request.json();
    const { circleId } = await params;

    // バリデーション：サークルIDが必要
    if (!circleId) {
      return NextResponse.json({ error: "Circle ID is required" }, { status: 400 });
    }

    // バリデーション：ユーザー情報が必要
    if (!body.userId || !body.userName) {
      return NextResponse.json({ error: "User ID and User Name are required" }, { status: 400 });
    }

    // サークルが存在するかチェック
    const circle = findCircleById(circleId);
    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // 参加申請メッセージを作成
    const joinMessage: Message = {
      id: faker.string.uuid(),
      chatId: "", // 後で設定される
      senderId: body.userId,
      content: `${body.userName}さんがサークルに参加を希望しています。`,
      timestamp: new Date().toISOString(),
      readStatus: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 既存のチャットを確認
    const existingChat = findChatByUserAndCircle(circleId, body.userId);
    
    let resultChat: Chat;

    if (existingChat) {
      // 既存チャットが存在する場合、メッセージを追加
      const updatedChat = addMessageToChat(existingChat.id, joinMessage);
      if (!updatedChat) {
        return NextResponse.json({ error: "Failed to add message to existing chat" }, { status: 500 });
      }
      resultChat = updatedChat;
    } else {
      // 既存チャットが存在しない場合、新しいチャットを作成
      resultChat = createChat(circleId, body.userId, joinMessage);
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: existingChat ? "Message added to existing chat" : "New chat created with join request",
      chat: resultChat,
      isNewChat: !existingChat,
    }, { status: existingChat ? 200 : 201 });

  } catch (error) {
    console.error("Error in circle join request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
