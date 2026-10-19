import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

interface FilterTagsProps {
  tags: { tagId: string; label: string }[]; // รายการที่เลือกได้
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}

const FilterTags = ({ tags, value, onChange }: FilterTagsProps) => {
  const anchor = useComboboxAnchor();
  const selected = value ?? [];
  const labelById = new Map(tags.map((t) => [t.tagId, t.label]));

  return (
    <Combobox
      multiple
      autoHighlight
      items={tags.map((t) => t.tagId)}
      value={selected}
      onValueChange={(next: string[]) =>
        onChange(next.length > 0 ? next : undefined)
      }
      itemToStringLabel={(id: string) => labelById.get(id) ?? id}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((id) => (
                <ComboboxChip key={id}>{labelById.get(id)}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={values.length > 0 ? "" : "All tags"}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No tags found.</ComboboxEmpty>
        <ComboboxList>
          {(id: string) => (
            <ComboboxItem key={id} value={id}>
              {labelById.get(id)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default FilterTags;
