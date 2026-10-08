"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const toISOString = (d: Date) => d.toISOString();
const displayLocalDate = (d: Date) => format(d, "HH:mm:ss dd-MM-yyyy");

const AppDatePicker = (props: {
  value: string;
  onChange: (value: string) => void;
  "aria-invalid"?: boolean;
}) => {
  const { value, onChange } = props;
  const dateObj = value ? parseISO(value) : undefined;

  const handleChange = (selectedDate: Date) => {
    const baseTime = dateObj ?? new Date();
    const merged = new Date(selectedDate);
    merged.setHours(
      baseTime.getHours(),
      baseTime.getMinutes(),
      baseTime.getSeconds(),
    );
    onChange(toISOString(merged));
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!value}
            className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
            aria-invalid={props["aria-invalid"]}
          />
        }
      >
        <CalendarIcon />
        <span className="pt-1">
          {dateObj ? displayLocalDate(dateObj) : "Pick a date"}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateObj}
          onSelect={handleChange}
          required
        />
      </PopoverContent>
    </Popover>
  );
};

export default AppDatePicker;
