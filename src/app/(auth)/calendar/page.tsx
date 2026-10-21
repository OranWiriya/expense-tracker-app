"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DailyCalendar,
  DailyCalendarDayButton,
} from "@/components/ui/daily-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDailySummary } from "@/hooks/useTransaction";
import { formatNumberWithCommas } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { format, isSameMonth } from "date-fns";
import { useState } from "react";

function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const ym = format(month, "yyyy-MM");
  const { data: totalByDay = [], isLoading } = useDailySummary(ym);

  if (isLoading) return <>loading...</>;

  return (
    <Card className="items-center ring-0 p-0 shadow-none ">
      <CardContent className="flex w-full h-full justify-center p-3">
        <DailyCalendar
          mode="single"
          className="border w-full p-0 "
          classNames={{
            disabled: "text-transarent",
          }}
          month={month}
          onMonthChange={setMonth}
          captionLayout="label"
          disabled={(date) => !isSameMonth(date, month)}
          components={{
            DayButton: ({ children, modifiers, day, className, ...props }) => {
              const key = format(day.date, "yyyy-MM-dd");
              const net = totalByDay.find((d) => d.day === key)?.net;
              const income = totalByDay.find((d) => d.day === key)?.income;
              const expense = totalByDay.find((d) => d.day === key)?.expense;

              return (
                <Popover>
                  <PopoverTrigger
                    render={
                      <DailyCalendarDayButton
                        day={day}
                        modifiers={modifiers}
                        className={cn("", className)}
                        {...props}
                      >
                        {children}
                        {net !== undefined && (
                          <div
                            className={cn(
                              "text-xs font-semibold leading-none sm:text-base",
                              net < 0 ? "text-rose-600" : "text-lime-600",
                            )}
                          >
                            {net > 0 ? "+" : ""}
                            {formatNumberWithCommas(String(net))}
                          </div>
                        )}
                      </DailyCalendarDayButton>
                    }
                  />
                  <PopoverContent className="w-auto p-0">
                    <Card>
                      <CardContent className="">
                        <div className="flex justify-between">
                          <span>date: </span>
                          {format(day.date, "yyyy-MM-dd")}
                        </div>
                        <div className="flex justify-between">
                          <span>income: </span>
                          {income
                            ? formatNumberWithCommas(String(income))
                            : "0"}
                        </div>
                        <div className="flex justify-between">
                          <span>expense: </span>
                          {expense
                            ? formatNumberWithCommas(String(expense))
                            : "0"}
                        </div>
                        <div className="flex justify-between">
                          <span>net: </span>
                          {net ? formatNumberWithCommas(String(net)) : "0"}
                        </div>
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default CalendarPage;
