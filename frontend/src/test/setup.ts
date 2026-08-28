import "@testing-library/jest-dom/vitest";

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    void callback;
  }
  disconnect() {}
  observe() {}
  unobserve() {}
}

window.ResizeObserver = ResizeObserverMock;
window.Element.prototype.hasPointerCapture = () => false;
window.Element.prototype.setPointerCapture = () => undefined;
window.Element.prototype.releasePointerCapture = () => undefined;
window.Element.prototype.scrollIntoView = () => undefined;
