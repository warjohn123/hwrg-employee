export default function hashStringToIndex(s: string, max: number) {
  // simple deterministic hash
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  return h % max;
}
