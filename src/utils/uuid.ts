import { v4 as uuidV4 } from "uuid";

export function generateUuid(length?: number): string {
  const uuid = uuidV4();

  if (length) {
    return uuid.replaceAll("-", "").slice(0, length);
  }

  return uuid;
}
