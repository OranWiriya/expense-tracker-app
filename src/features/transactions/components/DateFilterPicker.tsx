"use client";

import { format, parse } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FMT = "yyyy-MM-dd";

interface DateFilterPickerProps {
  value?: string; // yyyy-MM-dd
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean; // ใช้กันช่วงกลับด้าน
}

const DateFilterPicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
}: DateFilterPickerProps) => {
  const dateObj = value ? parse(value, FMT, new Date()) : undefined;

  return (
    <div className="flex items-center gap-1 w-full">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="default"
              data-empty={!value}
              className="flex-1 justify-start font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          <CalendarIcon />
          <span className="pt-1">
            {dateObj ? format(dateObj, "dd-MM-yyyy") : placeholder}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateObj}
            onSelect={(d) => onChange(d ? format(d, FMT) : undefined)}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          aria-label="Clear date"
          onClick={() => onChange(undefined)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
};

export default DateFilterPicker;
