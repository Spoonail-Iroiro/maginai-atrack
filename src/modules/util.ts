export function safe(fn: () => void) {
  try {
    fn();
  } catch (e) {
    console.error(e);
  }
}
