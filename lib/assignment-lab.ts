export function evaluateWallet({
  cost,
  coins,
  firstBill,
  secondBill,
}: {
  cost: number;
  coins: number;
  firstBill: number;
  secondBill: number;
}) {
  const available = coins + firstBill + secondBill;
  return {
    available,
    enough: available >= cost,
    difference: available - cost,
  };
}

export function evaluatePrecedence({
  first,
  second,
  third,
  parentheses,
}: {
  first: number;
  second: number;
  third: number;
  parentheses: boolean;
}) {
  return parentheses ? first * (second + third) : first * second + third;
}
