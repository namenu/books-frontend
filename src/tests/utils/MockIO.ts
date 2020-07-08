export default class MockIO {
  elements: Set<Element> = new Set();

  static visibleElements: Set<Element> = new Set();

  static activeIOs: Set<MockIO> = new Set();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    MockIO.activeIOs.add(this);
  }

  observe(e: Element) {
    if (!(e instanceof Element)) {
      throw new TypeError('not an element');
    }
    this.elements.add(e);
    this.changeVisibility(e, MockIO.visibleElements.has(e));
  }

  unobserve(e: Element) {
    if (!(e instanceof Element)) {
      throw new TypeError('not an element');
    }
    this.elements.delete(e);
  }

  private changeVisibility(e: Element, visible: boolean) {
    const entry = {
      target: e,
      intersectionRatio: visible ? 1 : 0,
      isIntersecting: visible,
    };
    this.callback([entry as any], this as unknown as IntersectionObserver);
  }

  static reveal(e: Element) {
    if (MockIO.visibleElements.has(e)) {
      return;
    }
    MockIO.visibleElements.add(e);
    // eslint-disable-next-line no-restricted-syntax
    for (const io of MockIO.activeIOs.values()) {
      if (io.elements.has(e)) {
        io.changeVisibility(e, true);
      }
    }
  }

  static hide(e: Element) {
    if (!MockIO.visibleElements.has(e)) {
      return;
    }
    MockIO.visibleElements.delete(e);
    // eslint-disable-next-line no-restricted-syntax
    for (const io of MockIO.activeIOs.values()) {
      if (io.elements.has(e)) {
        io.changeVisibility(e, false);
      }
    }
  }

  disconnect() {
    this.elements.clear();
    MockIO.activeIOs.delete(this);
  }

  static cleanup() {
    MockIO.activeIOs.clear();
    MockIO.visibleElements.clear();
  }
}

export function prepareTest() {
  let originalIO: typeof MockIO;

  beforeAll(() => {
    originalIO = window.IntersectionObserver as unknown as typeof MockIO;
    window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO as unknown as typeof IntersectionObserver;
  });

  afterEach(MockIO.cleanup);
}
