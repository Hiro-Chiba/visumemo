export type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  preview_text: string;
  thumb_path: string | null;
  content_updated_at: string;
  thumb_updated_at: string | null;
  is_deleted: boolean;
};

export type NoteInsert = {
  id?: string;
  user_id: string;
  title?: string;
  body?: string;
  preview_text?: string;
  thumb_path?: string | null;
  content_updated_at?: string;
  thumb_updated_at?: string | null;
  is_deleted?: boolean;
};

export type NoteUpdate = Partial<
  Pick<
    NoteRow,
    | 'title'
    | 'body'
    | 'preview_text'
    | 'thumb_path'
    | 'content_updated_at'
    | 'thumb_updated_at'
    | 'is_deleted'
  >
>;

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: NoteRow;
        Insert: NoteInsert;
        Update: NoteUpdate;
      };
    };
    Views: never;
    Functions: never;
    Enums: never;
  };
};

export type Note = NoteRow & {
  thumb_url: string | null;
};
