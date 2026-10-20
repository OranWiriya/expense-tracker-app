const formatterCurrency = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 2,
});

const formatNumberWithCommas = (value: string) => {
  const [intPart, decimalPart] = value.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined
    ? `${formattedInt}.${decimalPart}`
    : formattedInt;
};
const formatNumberByCurrency = (amount: number) =>
  formatterCurrency
    .formatToParts(amount)
    .map((part) => {
      return part.type === "currency" ? `${part.value} ` : part.value;
    })
    .join("");

const stripCommas = (value: string) => value.replace(/,/g, "");

const responsiveTextSize = (displayData: string) =>
  displayData.length > 12
    ? "text-lg sm:text-2xl md:text-4xl"
    : "text-xl sm:text-2xl lg:text-4xl ";

export {
  formatNumberWithCommas,
  stripCommas,
  formatNumberByCurrency,
  responsiveTextSize,
};
