import { Badge } from "@/components/ui/badge";
import { filterTagsById } from "@/lib/tag-utils";
import { cn } from "@/lib/utils";
import { useTagStore } from "@/store";

const scrollbarClassName: string = `overflow-x-auto overflow-y-hidden scroll-fade-x 
[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:mt-2 [&::-webkit-scrollbar-track]:bg-accent 
[&::-webkit-scrollbar-thumb]:border-[1.5px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding 
[&::-webkit-scrollbar-thumb]:bg-zinc-400`;

function TagCell({ tagId }: { tagId: string }) {
  const tagIds = tagId === "" ? [] : tagId.split(",");
  const tags = useTagStore((state) => state.tags);

  const displayTags = filterTagsById(tags, tagIds);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return tagIds.length > 0 ? (
    <div
      className={cn("flex gap-1 max-w-20 scroll-smooth", scrollbarClassName)}
      onWheel={handleWheel}
    >
      {displayTags.map((tag) => (
        <Badge key={tag.tagId} className="bg-zinc-200 text-accent-foreground">
          {tag.label}
        </Badge>
      ))}
    </div>
  ) : (
    <div></div>
  );
}

export default TagCell;
