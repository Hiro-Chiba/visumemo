'use client';

import { toJpeg } from 'html-to-image';

type CaptureOptions = {
  width?: number;
  quality?: number;
};

export const captureElementToJpeg = async (
  element: HTMLElement,
  { width = 960, quality = 0.9 }: CaptureOptions = {}
): Promise<Blob> => {
  const dataUrl = await toJpeg(element, {
    quality,
    width
  });
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob;
};
