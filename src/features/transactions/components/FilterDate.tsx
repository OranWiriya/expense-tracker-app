import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/lib/date-range";
import DateFilterPicker from "./DateFilterPicker";
import { format } from "date-fns";

interface FilterDateProps {
  value: DateRangeFilter | undefined;
  onChange: (value: DateRangeFilter | undefined) => void;
}

const FilterDate = ({ value, onChange }: FilterDateProps) => {
  const update = (patch: DateRangeFilter) => {
    const next = { ...value, ...patch };
    onChange(next.from || next.to ? next : undefined);
  };

  return (
    <div className="flex flex-col items-end w-full gap-2">
      <DateFilterPicker
        placeholder="From"
        value={value?.from}
        onChange={(from) => update({ from })}
        disabled={(d) => !!value?.to && format(d, "yyyy-MM-dd") > value.to}
      />

      <DateFilterPicker
        placeholder="To"
        value={value?.to}
        onChange={(to) => update({ to })}
        disabled={(d) => !!value?.from && format(d, "yyyy-MM-dd") < value.from}
      />
    </div>
  );
};
export default FilterDate;
