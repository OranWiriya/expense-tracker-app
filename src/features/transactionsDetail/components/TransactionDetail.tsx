import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTransactionStore } from "@/store";

interface TransactionDetailProps {
  transactionId: string;
}
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-UK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));

const formatValue = (value: unknown): React.ReactNode => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (value instanceof Array && value.length === 0)
  )
    return "-";
  if (typeof value === "string" && ISO_DATE_RE.test(value)) {
    return formatDate(value);
  }
  if (value instanceof Array && value.length > 0) {
    return value.map(formatValue);
  }
  return String(value);
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="grid grid-cols-6">
      <span className="col-span-1 font-bold ">{label}:</span>
      <span className="col-span-3">{value}</span>
    </div>
  );
};

const TransactionDetail = (props: TransactionDetailProps) => {
  const { transactionId } = props;
  const transactionDetail = useTransactionStore((state) =>
    state.transactions.find((tx) => tx.transactionId === transactionId),
  );

  console.log(typeof transactionDetail?.date);
  return (
    <Card className="m-3">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <h1>TransactionDetail:</h1>
          <span className="text-primary-foreground font-bold">
            {transactionId}
          </span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="gap-5">
        {Object.entries(transactionDetail ?? {}).map(([key, value]) => (
          <DetailRow key={key} label={key} value={formatValue(value)} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionDetail;
