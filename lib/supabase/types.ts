// Hand-written to match supabase/migrations/0001_init.sql. Once the Supabase
// CLI is set up locally, this can be regenerated with:
//   supabase gen types typescript --project-id ugonzxnotksihttdoufu > lib/supabase/types.ts

export type SectionType =
  | "hero"
  | "stats"
  | "photo-text"
  | "steps"
  | "voices"
  | "partners"
  | "cta"
  | "team-member"
  | "text"
  | "content-cards"
  | "comparison"
  | "case-study"
  | "icon-cards"
  | "home-compare-table"
  | "product-problem-accordion"
  | "product-talk-cta"
  | "product-compare-table"
  | "product-vendor-questions"
  | "impact-manual-table"
  | "impact-year-in-review"
  | "contact-form-section"
  | "accordion"
  | "image";

export type BlogBlockType = "heading" | "paragraph" | "quote" | "photo";

export type PageStatus = "draft" | "published";

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          status: PageStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          status?: PageStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]>;
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          page_id: string;
          type: SectionType;
          position: number;
          name: string;
          background_color: string | null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: Record<string, any>;
          hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          type: SectionType;
          position?: number;
          name?: string;
          background_color?: string | null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content?: Record<string, any>;
          hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sections"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "sections_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "pages";
            referencedColumns: ["id"];
          }
        ];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          author: string | null;
          category: string;
          featured_image_url: string | null;
          featured_image_alt: string | null;
          featured_image_caption: string | null;
          status: PageStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          author?: string | null;
          category: string;
          featured_image_url?: string | null;
          featured_image_alt?: string | null;
          featured_image_caption?: string | null;
          status?: PageStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      blog_blocks: {
        Row: {
          id: string;
          post_id: string;
          type: BlogBlockType;
          position: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          type: BlogBlockType;
          position?: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_blocks"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "blog_blocks_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          }
        ];
      };
      media: {
        Row: {
          id: string;
          path: string;
          url: string;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          url: string;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [];
      };
      deleted_pages: {
        Row: {
          id: string;
          slug: string;
          name: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot: Record<string, any>;
          deleted_at: string;
          purge_at: string;
          restored: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot: Record<string, any>;
          deleted_at?: string;
          purge_at?: string;
          restored?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["deleted_pages"]["Insert"]>;
        Relationships: [];
      };
      deleted_blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot: Record<string, any>;
          deleted_at: string;
          purge_at: string;
          restored: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot: Record<string, any>;
          deleted_at?: string;
          purge_at?: string;
          restored?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["deleted_blog_posts"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: Record<string, any>;
          updated_at: string;
        };
        Insert: {
          key: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: Record<string, any>;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
