import { NextRequest, NextResponse } from "next/server";
import { Circle, Chat, Message } from "@/types";
import { findCircleById, findChatByUserAndCircle, addMessageToChat, createChat } from "@/lib/mockData";
import { faker } from "@faker-js/faker";

// 特定ユーザーとの会話履歴を取得
export async function GET(
  request: NextRequest, 
  { params }: { params: { circleId: string; userId: string } }
) {
  try {
    const { circleId, userId } = await params;

    // バリデーション：必要なパラメータが揃っているかチェック
    if (!circleId) {
      return NextResponse.json({ error: "Circle ID is required" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // サークルが存在するかチェック
    const circle = findCircleById(circleId);
    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // 指定されたユーザーとのチャットを検索
    const chat = findChatByUserAndCircle(circleId, userId);

    if (!chat) {
      // チャットが存在しない場合は空の履歴を返す
      return NextResponse.json({
        success: true,
        circleId,
        userId,
        chat: null,
        messages: [],
        message: "No chat history found between this user and circle"
      });
    }

    // チャット履歴を返す
    return NextResponse.json({
      success: true,
      circleId,
      userId,
      chat: {
        id: chat.id,
        circleId: chat.circleId,
        userId: chat.userId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
      messages: chat.messages || [],
    });

  } catch (error) {
    console.error("Error getting chat history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 特定ユーザーとの会話にメッセージを送信
export async function POST(
  request: NextRequest, 
  { params }: { params: { circleId: string; userId: string } }
) {
  try {
    const body = await request.json();
    const { circleId, userId } = await params;

    // バリデーション：必要なパラメータが揃っているかチェック
    if (!circleId) {
      return NextResponse.json({ error: "Circle ID is required" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // リクエストボディのバリデーション
    if (!body.senderId || !body.content) {
      return NextResponse.json({ 
        error: "Sender ID and message content are required" 
      }, { status: 400 });
    }

    if (typeof body.content !== "string" || body.content.trim().length === 0) {
      return NextResponse.json({ 
        error: "Message content must be a non-empty string" 
      }, { status: 400 });
    }

    // サークルが存在するかチェック
    const circle = findCircleById(circleId);
    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // 新しいメッセージを作成
    const newMessage: Message = {
      id: faker.string.uuid(),
      chatId: "", // 後で設定される
      senderId: body.senderId,
      content: body.content.trim(),
      timestamp: new Date().toISOString(),
      readStatus: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 既存のチャットを確認
    const existingChat = findChatByUserAndCircle(circleId, userId);
    
    let resultChat: Chat;

    if (existingChat) {
      // 既存チャットが存在する場合、メッセージを追加
      const updatedChat = addMessageToChat(existingChat.id, newMessage);
      if (!updatedChat) {
        return NextResponse.json({ 
          error: "Failed to add message to existing chat" 
        }, { status: 500 });
      }
      resultChat = updatedChat;
    } else {
      // 既存チャットが存在しない場合、新しいチャットを作成
      resultChat = createChat(circleId, userId, newMessage);
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: existingChat ? "Message sent successfully" : "New chat created and message sent",
      chat: {
        id: resultChat.id,
        circleId: resultChat.circleId,
        userId: resultChat.userId,
        createdAt: resultChat.createdAt,
        updatedAt: resultChat.updatedAt,
      },
      newMessage: resultChat.messages?.[resultChat.messages.length - 1],
      isNewChat: !existingChat,
    }, { status: existingChat ? 200 : 201 });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
