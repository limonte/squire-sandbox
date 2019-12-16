export as namespace SquireClass;

export = SquireClass;

declare global {
  interface Window {
    Squire: SquireClass;
  }
}

declare interface SquireClass {
  new (obj: HTMLElement): SquireEditor;
}

declare class SquireEditor {
  setHTML(html: string): void;
  getHTML(): string;
  focus(): void;
  insertImage(image: ArrayBuffer, imageAttributes: any): void;
  addEventListener(event: string, callback: (e: Event) => void): void;
  setKeyHandler(key: string, handler: (self: SquireEditor, event: Event) => void): void;
  removeAllFormatting(): void;
}
