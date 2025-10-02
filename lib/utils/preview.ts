export const buildPreviewText = (body: string): string => {
  return body.replace(/\s+/g, ' ').slice(0, 80);
};
