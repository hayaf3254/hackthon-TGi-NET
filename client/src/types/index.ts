export interface Circle{
  id: number;
  name: string;
  description: string;
  type: "university" | "amateur";
  tags?: string[];
  membersCount?: number;
  location?: string;
  activeDays?: string[];
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}