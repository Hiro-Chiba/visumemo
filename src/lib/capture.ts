'use client';

import { toJpeg } from 'html-to-image';

type CaptureOptions = {
  width?: number;
  quality?: number;
};

export async function captureElementToJpeg(
  element: HTMLElement,
  { width = 960, quality = 0.9 }: CaptureOptions = {}
): Promise<Blob> {
  const dataUrl = await toJpeg(element, { width, quality });
  const response = await fetch(dataUrl);
  return response.blob();
}
