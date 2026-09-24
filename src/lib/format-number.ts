const formatNumberWithCommas = (value: string) => {
  const [intPart, decimalPart] = value.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined
    ? `${formattedInt}.${decimalPart}`
    : formattedInt;
};

const stripCommas = (value: string) => value.replace(/,/g, "");

const responsiveTextSize = (displayData: string) =>
  displayData.length > 9
    ? "text-lg sm:text-xl md:text-2xl"
    : "text-2xl sm:text-4xl lg:text-6xl ";

export { formatNumberWithCommas, stripCommas, responsiveTextSize };
