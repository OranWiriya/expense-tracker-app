import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppMultipleSelect from "./AppMultipleSelect";
import AppDatePicker from "./AppDatePicker";
import { accountItems, expenseItems } from "./topbar-data";

const expenseHeader = {
  Title: "Expense Amount",
  SubTitle: "Make a Expense",
};

const incomeHeader = {
  Title: "Income Amount",
  SubTitle: "Make a Income",
};

const expenseFields = [
  {
    name: "amount",
    label: "Expense Amount",
    type: "number",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
  },
  {
    name: "tag",
    label: "Tag",
    type: "multi-select",
  },
  {
    name: "account",
    label: "Account",
    type: "select",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
  },
];

const incomeFields = [
  {
    name: "amount",
    label: "Income Amount",
    type: "number",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
  },
  {
    name: "tag",
    label: "Tag",
    type: "multi-select",
  },
  {
    name: "account",
    label: "Account",
    type: "select",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
  },
];

const inputSelection = ({ type, name }: { type: string; name: string }) => {
  switch (type) {
    case "number": {
      return <Input type="number" />;
    }
    case "select": {
      const itemData = name === "account" ? accountItems : expenseItems;
      return (
        <Select items={itemData}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              <SelectLabel>
                {name === "account" ? "Account" : "Catagory"}
              </SelectLabel>
              {itemData.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    case "multi-select": {
      return <AppMultipleSelect />;
    }
    case "date": {
      return <AppDatePicker />;
    }
    default: {
      return <Input type="text" />;
    }
  }
};

const AppDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={<Button className={"cursor-pointer"}>Transcation +</Button>}
        />
        <DialogContent className="sm:max-w-sm">
          <Tabs defaultValue="expense">
            <TabsList>
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
            <TabsContent value="expense">
              <DialogHeader className={"py-4"}>
                <DialogTitle>{expenseHeader.Title}</DialogTitle>
                <DialogDescription>{expenseHeader.SubTitle}</DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-2">
                {expenseFields.map((field) => (
                  <Field key={field.name} className="gap-1">
                    <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                    {inputSelection({ type: field.type, name: field.name })}
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>

            <TabsContent value="income">
              <DialogHeader className={"py-4"}>
                <DialogTitle>{incomeHeader.Title}</DialogTitle>
                <DialogDescription>{incomeHeader.SubTitle}</DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-2">
                {incomeFields.map((field) => (
                  <Field key={field.name} className="gap-1">
                    <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                    {inputSelection({ type: field.type, name: field.name })}
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AppDialog;
