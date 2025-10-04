import { NextRequest } from "next/server";
import { Circle } from "@/types";
import { mockCircles } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const limitParameter = url.searchParams.get("limit");
  const offsetParameter = url.searchParams.get("offset");
  const limit = Math.max(1, Math.min(Number(limitParameter) || 10, 100));
  const offset = Math.max(0, Number(offsetParameter) || 0);

  const circles = mockCircles.slice(offset, offset + limit);
  return new Response(JSON.stringify(circles), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newCircle: Circle = {
    id: mockCircles.length + 1,
    name: body.name,
    description: body.description,
    type: body.type ? body.type : "",
    tags: body.tags ? body.tags : [],
    membersCount: body.membersCount ? body.membersCount : 0,
    location: body.location ? body.location : "",
    activeDays: body.activeDays ? body.activeDays : [],
    ownerId: body.ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCircles.push(newCircle);
  
  return new Response(JSON.stringify(newCircle), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
