type FormatPercentageOptions = {
  decimalPlaces?: number;
  addPrefix?: boolean;
};

export const formatPercentage = (
  value: number,
  { decimalPlaces = 1, addPrefix = false }: FormatPercentageOptions = {},
): string => {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);

  return addPrefix && value > 0 ? `+${formattedValue}` : formattedValue;
};
