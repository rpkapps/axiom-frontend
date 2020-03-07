export function objectsEqual(a: Object, b: Object) {
  return JSON.stringify(a) === JSON.stringify(b);
}
