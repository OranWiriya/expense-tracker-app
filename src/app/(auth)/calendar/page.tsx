"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

function CalendarPage() {
  return (
    <Card className="w-full items-center ring-0 p-0 shadow-none">
      <CardContent className="flex justify-center w-fit">
        <Calendar
          mode="single"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)] lg:[--cell-size:--spacing(24)] "
          numberOfMonths={1}
          captionLayout="label"
          formatters={{
            formatMonthDropdown: (date) => {
              return date.toLocaleString("default", { month: "long" });
            },
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6;
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {!modifiers.outside && (
                    <span>{isWeekend ? "$120" : "$100"}</span>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default CalendarPage;
