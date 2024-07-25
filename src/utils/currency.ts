const formatter = Intl.NumberFormat('nl-Nl', {
  style: 'currency',
  currency: 'EUR',
});

const roundedAmountFormatter = Intl.NumberFormat('nl-Nl', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value?: number) => formatter.format(value ?? 0);

/** Convert Decimal formatted numbers  to Dutch values */
export const formatAmount = (value?: number) => {
  if (value !== 0 && !value) return '';
  const amountFormatter = Intl.NumberFormat('nl-Nl');
  return amountFormatter.format(value);
};

/** Convert Dutch formatted nutbers back to their original values */
export const formatPlainStringToCurrency = (currency: string) => {
  const thousandSeparator = Intl.NumberFormat('nl-NL')
    .format(11111)
    .replace(/\p{Number}/gu, '');
  const decimalSeparator = Intl.NumberFormat('nl-NL')
    .format(1.1)
    .replace(/\p{Number}/gu, '');

  return parseFloat(
    currency
      ?.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.')
  );
};

export const roundValue = ({
  value,
}: {
  value: number | string;
  addTrailingZeroes?: boolean;
}): number => {
  const rounded = Math.round((+value + Number.EPSILON) * 100) / 100;
  return rounded;
};

export const formatCurrencyAfterRounding = ({ value }: { value?: number }) => {
  if (!value) {
    return formatCurrency(0);
  }
  return formatCurrency(roundValue({ value }));
};

export const formatAmountAfterRounding = ({ value }: { value: number }) => {
  if (!value) {
    return roundedAmountFormatter.format(0);
  }
  return roundedAmountFormatter.format(value);
};
