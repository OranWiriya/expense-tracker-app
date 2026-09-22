import { create } from "zustand";

export interface TagsType {
  tagId: string;
  label: string;
  createdAt: string;
}

interface TagStoreState {
  tags: TagsType[];
  addTag: (tag: TagsType) => void;
}

const useTagStore = create<TagStoreState>((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
}));

export default useTagStore;
