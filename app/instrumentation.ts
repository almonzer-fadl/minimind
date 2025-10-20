export async function register() {
  // Guard against SSR environment missing `self`
  if (typeof (globalThis as any).self === 'undefined') {
    (globalThis as any).self = globalThis as any;
  }
}


