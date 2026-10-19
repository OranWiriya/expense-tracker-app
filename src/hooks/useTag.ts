import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { TagsType } from "@/lib/tag-utils";

export const tagQueries = {
  all: () => ["tags"] as const,
};

export const useTagList = () =>
  useQuery({
    queryKey: tagQueries.all(),
    queryFn: () => http.get<TagsType[]>("/api/v1/tags"),
  });
