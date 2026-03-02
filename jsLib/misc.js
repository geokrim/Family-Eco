function fixAmount(num) {
  const value = parseFloat(num);

  if (isNaN(value)) {
    return num;
  }

  const formatter = new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

function fixAllAmounts() {
  $('[id*="amount"],[id*="total"],[class*="amount"]').each(function () {
    const originalText = $(this).text();
    const match = originalText.match(/[\\d\\.,]+/);

    if (match) {
      let numToFix = match[0];

      numToFix = numToFix.replace(",", ".");

      $(this).text(fixAmount(numToFix));
    }
  });
}
