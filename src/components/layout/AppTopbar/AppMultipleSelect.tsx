import {
  useComboboxAnchor,
  ComboboxChipsInput,
  ComboboxContent,
  Combobox,
  ComboboxChips,
  ComboboxValue,
  ComboboxChip,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { TagsType, useTagStore } from "@/store";

import { useMemo, useState } from "react";

interface AppMultipleSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}
const AppMultipleSelect = (props: AppMultipleSelectProps) => {
  const { value, onChange } = props;
  const anchor = useComboboxAnchor();
  const { tags, addTag } = useTagStore();

  const [newlyTags, setNewlyTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const itemsToRender = useMemo(
    () =>
      [...tags].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [tags],
  );

  const createTag = (raw: string) => {
    let selectedTag: TagsType;
    const tag = raw.trim();
    const currentValue = value ?? [];
    const alreadyInList = tags.find(
      (item) => String(item.label).toLowerCase() === tag.toLowerCase(),
    );

    if (!tag) return;
    if (alreadyInList) {
      selectedTag = alreadyInList;
    } else {
      selectedTag = {
        tagId: crypto.randomUUID().slice(0, 4),
        label: tag,
        createdAt: new Date().toISOString(),
      };
      setNewlyTags((prev) => [...prev, selectedTag.tagId]);
      addTag(selectedTag);
    }
    if (!currentValue.includes(selectedTag.tagId)) {
      onChange([...currentValue, selectedTag.tagId]);
    }

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      createTag(inputValue);
    }
  };

  const classNameForNewChip = (v: string) => {
    if (newlyTags.includes(v)) return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Combobox
      multiple
      autoHighlight
      items={itemsToRender.map((i) => i.label)}
      value={value}
      onValueChange={onChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((v: string) => (
                <ComboboxChip key={v} className={classNameForNewChip(v)}>
                  {tags.find((i) => i.tagId === v)?.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={
                  values.length > 0 ? "" : "Select or create tag(s) here"
                }
                onKeyDown={handleKeyDown}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>
          {inputValue.trim()
            ? `Enter to create "${inputValue.trim()}"`
            : "No items found."}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item}
              value={tags.find((i) => i.label === item)?.tagId}
            >
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default AppMultipleSelect;
