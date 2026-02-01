"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  classes: { id: number; name: string }[];
};

export function ClassCombobox({
  defaultValue,
  label = "Kelas",
  value,
  onChange,
  classes,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = classes.find(
    (cls) => cls.id.toString() === value,
  )?.name;

  return (
    <div className="grid gap-3">
      <Label>{label}</Label>

      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[180px] justify-between"
            onWheel={(e) => e.preventDefault()}
          >
            {selectedLabel ?? "Pilih kelas"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 pointer-events-none" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[180px] p-0" align="start">
          <Command defaultValue={defaultValue}>
            <CommandInput placeholder="Cari kelas..." />

            <CommandList className="max-h-40 overflow-y-auto overscroll-contain">
              <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>

              <CommandGroup>
                {classes.map((cls) => (
                  <CommandItem
                    key={cls.id}
                    value={cls.name}
                    className="z-50"
                    onSelect={() => {
                      onChange(cls.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cls.id.toString()
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {cls.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
