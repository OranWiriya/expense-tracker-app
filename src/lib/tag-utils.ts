export interface TagsType {
  tagId: string;
  label: string;
  createdAt: string;
}

export const filterTagsById = (tags: TagsType[], tagIds: string[]) =>
  tags.filter((tag) => tagIds.includes(tag.tagId));
