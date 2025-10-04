import { Circle } from "@/types";
import { faker } from "@faker-js/faker";

export const mockCircles: Circle[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: faker.company.name(),
  description: faker.lorem.sentences(3),
  type: faker.helpers.arrayElement<"university" | "amateur">(["university", "amateur"]),
  tags: faker.helpers.arrayElements(["スポーツ", "音楽", "アート", "テクノロジー", "アウトドア", "読書", "旅行"], { min: 1, max: 3 }),
  membersCount: faker.number.int({ min: 5, max: 100 }),
  location: faker.location.city(),
  activeDays: faker.helpers.arrayElements(["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"], { min: 1, max: 7 }),
  ownerId: index + 1,
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
}));
