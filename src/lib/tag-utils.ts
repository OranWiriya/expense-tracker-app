import { TagsType } from "@/store";

export const filterTagsById = (tags: TagsType[], tagIds: string[]) =>
  tags.filter((tag) => tagIds.includes(tag.tagId));
