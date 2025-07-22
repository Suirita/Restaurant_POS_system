export {};

declare global {
  interface Window {
    api: {
      openKeyboard: () => void;
      saveImage: (data: { path: string; content: string }) => Promise<any>;
      updateJson: (data: { path: string; content: any }) => Promise<any>;
      deleteImage: (data: { path: string }) => Promise<any>;
    };
  }
}
