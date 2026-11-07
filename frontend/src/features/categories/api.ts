import type { Category, CategoryTemplate } from '@/features/categories/types';
import { apiRequest } from '@/lib/api-client';

type ItemsResponse<T> = {
  items: T[];
};

export async function getCategoryTemplates() {
  const response = await apiRequest<ItemsResponse<CategoryTemplate>>('/api/v1/category-templates');
  return response.items;
}

export async function getCategories() {
  const response = await apiRequest<ItemsResponse<Category>>('/api/v1/categories');
  return response.items;
}

export async function createCategories(templateIds: readonly string[]) {
  const response = await apiRequest<ItemsResponse<Category>>('/api/v1/categories', {
    method: 'POST',
    body: JSON.stringify({ template_ids: templateIds }),
  });
  return response.items;
}
