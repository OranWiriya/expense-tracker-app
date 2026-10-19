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
import { useTagList } from "@/hooks/useTag";
import { useTagStore } from "@/store";

import { useMemo, useState } from "react";

interface AppMultipleSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  newTagNames: string[];
  onNewTagNamesChange: (names: string[]) => void;
}
const NEW_PREFIX = "new:";

const AppMultipleSelect = (props: AppMultipleSelectProps) => {
  const { value, onChange, newTagNames, onNewTagNamesChange } = props;
  const anchor = useComboboxAnchor();
  const [inputValue, setInputValue] = useState<string>("");
  const { data: tags = [] } = useTagList();

  const comboValue = [...value, ...newTagNames.map((n) => `${NEW_PREFIX}${n}`)];

  const sortedTagIds = useMemo(
    () =>
      [...tags]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((t) => t.tagId),
    [tags],
  );
  const createTag = (raw: string) => {
    const name = raw.trim();
    if (!name) return;

    const existing = tags.find(
      (t) => t.label.toLowerCase() === name.toLowerCase(),
    );

    if (existing) {
      if (!value.includes(existing.tagId)) onChange([...value, existing.tagId]);
    } else if (
      !newTagNames.some((n) => n.toLowerCase() === name.toLowerCase())
    ) {
      onNewTagNamesChange([...newTagNames, name]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      createTag(inputValue);
    }
  };

  const handleOnChange = (next: string[]) => {
    const nextIds = next.filter((v) => !v.startsWith(NEW_PREFIX));
    const nextNames = next
      .filter((v) => v.startsWith(NEW_PREFIX))
      .map((v) => v.slice(NEW_PREFIX.length));

    onChange(nextIds);
    onNewTagNamesChange(nextNames);
  };

  return (
    <Combobox
      multiple
      autoHighlight
      items={sortedTagIds}
      value={comboValue}
      onValueChange={handleOnChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((v) =>
                v.startsWith(NEW_PREFIX) ? (
                  <ComboboxChip
                    key={v}
                    className="bg-primary text-primary-foreground"
                  >
                    {v.slice(NEW_PREFIX.length)}
                  </ComboboxChip>
                ) : (
                  <ComboboxChip key={v}>
                    {tags.find((t) => t.tagId === v)?.label}
                  </ComboboxChip>
                ),
              )}
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
          {(tagId: string) => (
            <ComboboxItem key={tagId} value={tagId}>
              {tags.find((t) => t.tagId === tagId)?.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default AppMultipleSelect;
