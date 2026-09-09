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

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

const AppMultipleSelect = () => {
  const anchor = useComboboxAnchor();
  return (
    <Combobox multiple autoHighlight items={frameworks}>
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values) => (
            <>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default AppMultipleSelect;
