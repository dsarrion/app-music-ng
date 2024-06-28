// Polyfill para requestAnimationFrame
if (typeof requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = function(callback: FrameRequestCallback) {
    return setTimeout(callback, 0);
  };
}

if (typeof cancelAnimationFrame === 'undefined') {
  (global as any).cancelAnimationFrame = function(id: number) {
    clearTimeout(id);
  };
}

// Polyfill para customElements
if (typeof customElements === 'undefined') {
  (global as any).customElements = {
    _elements: new Map<string, Function>(),

    define(name: string, constructor: Function) {
      this._elements.set(name, constructor);
      console.warn(`customElements.define('${name}', ...) is not supported in this environment.`);
    },

    get(name: string) {
      return this._elements.get(name);
    }
  };
}