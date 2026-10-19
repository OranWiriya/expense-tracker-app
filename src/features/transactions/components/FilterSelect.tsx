import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItemType } from "@/lib/select-options";

const FilterSelect = ({
  value,
  onChange,
  label,
  items, // [{ value, label }] don't need "all"
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label: string;
  items: SelectItemType[];
}) => {
  const options = [{ value: "all", label: `All ${label}` }, ...items];

  return (
    <Select
      items={options}
      value={value ?? "all"}
      onValueChange={(v) => onChange(!v || v === "all" ? undefined : v)}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
