export as namespace SquireClass;

declare global {
  interface Window {
    // @ts-ignore
    Squire: SquireClass;
  }
}

declare interface SquireClass {
  new(obj: HTMLElement): SquireEditor;
}

export declare class SquireEditor {
  setHTML(html: string): void;
  getHTML(): string;
  focus(): void;
  getSelection(): Range;
  setSelection(range: Range): SquireEditor;
  getSelectedText(): string;
  insertImage(image: ArrayBuffer, imageAttributes: any): void;
  addEventListener(event: string, callback: (e: Event) => void): void;
  setKeyHandler(key: string, handler: (self: SquireEditor, event: Event) => void): void;
  hasFormat(tag: string, attributes?: any): boolean;
  changeFormat(formattingToAdd: any, formattingToRemove: any, range: Range): void;
  removeAllFormatting(): void;
}

declare class WillPasteEvent extends ClipboardEvent {
  fragment: DocumentFragment;
  text: string;
}
