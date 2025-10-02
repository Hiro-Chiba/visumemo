export type NoteDTO = {
  id: string;
  userId: string;
  title: string;
  body: string;
  previewText: string;
  thumbUrl: string | null;
  contentUpdatedAt: string;
  thumbUpdatedAt: string | null;
  isDeleted: boolean;
};
