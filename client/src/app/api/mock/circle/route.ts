import { NextRequest, NextResponse } from "next/server";
import { Circle } from "@/types";
import { mockCircles } from "@/lib/mockData";
import { faker } from "@faker-js/faker";

// サークル一覧を取得
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const limitParameter = url.searchParams.get("limit");
    const offsetParameter = url.searchParams.get("offset");
    const typeParameter = url.searchParams.get("type");
    const tagParameter = url.searchParams.get("tag");
    
    const limit = Math.max(1, Math.min(Number(limitParameter) || 20, 100));
    const offset = Math.max(0, Number(offsetParameter) || 0);

    let filteredCircles = mockCircles;

    // タイプでフィルタリング
    if (typeParameter && ["university", "amateur"].includes(typeParameter)) {
      filteredCircles = filteredCircles.filter(circle => circle.type === typeParameter);
    }

    // タグでフィルタリング
    if (tagParameter) {
      filteredCircles = filteredCircles.filter(circle => 
        circle.tags?.some(tag => tag.toLowerCase().includes(tagParameter.toLowerCase()))
      );
    }

    const circles = filteredCircles.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      circles: circles,
      total: filteredCircles.length,
      limit,
      offset
    });
  } catch (error) {
    console.error("Error getting circles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 新しいサークルを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション：必須フィールドの確認
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string" 
      }, { status: 400 });
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
      return NextResponse.json({ 
        error: "Description is required and must be a non-empty string" 
      }, { status: 400 });
    }

    if (!body.type || !["university", "amateur"].includes(body.type)) {
      return NextResponse.json({ 
        error: "Type must be either 'university' or 'amateur'" 
      }, { status: 400 });
    }

    if (!body.ownerId || typeof body.ownerId !== 'string') {
      return NextResponse.json({ 
        error: "Owner ID is required" 
      }, { status: 400 });
    }

    // 新しいサークルのIDを生成
    const newCircleId = `circle-${String(mockCircles.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    // 新しいサークルオブジェクトを作成
    const newCircle: Circle = {
      id: newCircleId,
      name: body.name.trim(),
      description: body.description.trim(),
      type: body.type,
      tags: Array.isArray(body.tags) ? body.tags.filter((tag: any) => typeof tag === 'string' && tag.trim().length > 0) : [],
      membersCount: 1, // 作成者が最初のメンバー
      location: typeof body.location === 'string' ? body.location.trim() : "",
      activeDays: Array.isArray(body.activeDays) ? body.activeDays.filter((day: any) => typeof day === 'string') : [],
      ownerId: body.ownerId,
      createdAt: now,
      updatedAt: now,
      chats: [],
    };

    // サークルを配列に追加
    mockCircles.push(newCircle);

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: "Circle created successfully",
      circle: newCircle,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating circle:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
