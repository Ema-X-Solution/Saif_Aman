import { sleep } from "@/utils/sleep";

export async function withMockLatency<T>(result: T, ms = 320): Promise<T> {
  await sleep(ms);
  return result;
}
