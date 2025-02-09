export interface CardItemProps {
  title: string;
  body: string;
  banner: string;
  category_name: string;
  author_name: string;
  avatar: string;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_data: number;
  has_more_pages: number;
}
