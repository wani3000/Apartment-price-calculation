export type RepaymentType =
  | "equal-payment"
  | "equal-principal"
  | "bullet"
  | "step-up";

export type LoanInput = {
  repaymentType: RepaymentType;
  principalWon: number;
  months: number;
  annualRatePercent: number;
};

export type LoanScheduleRow = {
  month: number;
  paymentWon: number;
  principalWon: number;
  interestWon: number;
  balanceWon: number;
};

export type LoanResult = {
  input: LoanInput;
  rows: LoanScheduleRow[];
  totalPaymentWon: number;
  totalInterestWon: number;
  firstMonthPaymentWon: number;
};

const clampPositive = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

const monthlyRate = (annualRatePercent: number) => annualRatePercent / 100 / 12;

const roundWon = (value: number) => Math.round(value);

const calcEqualPayment = (input: LoanInput): LoanResult => {
  const { principalWon, months, annualRatePercent } = input;
  const r = monthlyRate(annualRatePercent);
  const fixedPayment =
    r === 0 ? principalWon / months : (principalWon * r) / (1 - Math.pow(1 + r, -months));

  let balance = principalWon;
  const rows: LoanScheduleRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = roundWon(balance * r);
    let principal = roundWon(fixedPayment - interest);
    if (month === months || principal > balance) principal = balance;
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    rows.push({
      month,
      paymentWon: payment,
      principalWon: principal,
      interestWon: interest,
      balanceWon: balance,
    });
  }

  const totalPaymentWon = rows.reduce((sum, row) => sum + row.paymentWon, 0);
  const totalInterestWon = rows.reduce((sum, row) => sum + row.interestWon, 0);
  return {
    input,
    rows,
    totalPaymentWon,
    totalInterestWon,
    firstMonthPaymentWon: rows[0]?.paymentWon || 0,
  };
};

const calcEqualPrincipal = (input: LoanInput): LoanResult => {
  const { principalWon, months, annualRatePercent } = input;
  const r = monthlyRate(annualRatePercent);
  let balance = principalWon;
  const principalBase = principalWon / months;
  const rows: LoanScheduleRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = roundWon(balance * r);
    let principal = roundWon(principalBase);
    if (month === months || principal > balance) principal = balance;
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);
    rows.push({
      month,
      paymentWon: payment,
      principalWon: principal,
      interestWon: interest,
      balanceWon: balance,
    });
  }

  const totalPaymentWon = rows.reduce((sum, row) => sum + row.paymentWon, 0);
  const totalInterestWon = rows.reduce((sum, row) => sum + row.interestWon, 0);
  return {
    input,
    rows,
    totalPaymentWon,
    totalInterestWon,
    firstMonthPaymentWon: rows[0]?.paymentWon || 0,
  };
};

const calcBullet = (input: LoanInput): LoanResult => {
  const { principalWon, months, annualRatePercent } = input;
  const r = monthlyRate(annualRatePercent);
  const rows: LoanScheduleRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = roundWon(principalWon * r);
    const principal = month === months ? principalWon : 0;
    const payment = interest + principal;
    const balance = month === months ? 0 : principalWon;
    rows.push({
      month,
      paymentWon: payment,
      principalWon: principal,
      interestWon: interest,
      balanceWon: balance,
    });
  }

  const totalPaymentWon = rows.reduce((sum, row) => sum + row.paymentWon, 0);
  const totalInterestWon = rows.reduce((sum, row) => sum + row.interestWon, 0);
  return {
    input,
    rows,
    totalPaymentWon,
    totalInterestWon,
    firstMonthPaymentWon: rows[0]?.paymentWon || 0,
  };
};

const simulateStepUpBalance = (
  principalWon: number,
  months: number,
  annualRatePercent: number,
  firstPaymentWon: number,
  annualIncreaseRate = 0.05,
) => {
  const r = monthlyRate(annualRatePercent);
  const growth = Math.pow(1 + annualIncreaseRate, 1 / 12) - 1;
  let balance = principalWon;

  for (let month = 1; month <= months; month += 1) {
    const payment = firstPaymentWon * Math.pow(1 + growth, month - 1);
    const interest = balance * r;
    const principal = payment - interest;
    if (principal <= 0) return Number.POSITIVE_INFINITY;
    balance -= principal;
    if (balance <= 0) return balance;
  }
  return balance;
};

const calcStepUp = (input: LoanInput): LoanResult => {
  const { principalWon, months, annualRatePercent } = input;
  const baseline = calcEqualPayment(input).firstMonthPaymentWon;
  let low = Math.max(1, Math.floor(baseline * 0.3));
  let high = Math.max(baseline * 3, principalWon / months);

  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    const remain = simulateStepUpBalance(
      principalWon,
      months,
      annualRatePercent,
      mid,
    );
    if (remain > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const firstPayment = Math.ceil(high);
  const r = monthlyRate(annualRatePercent);
  const growth = Math.pow(1 + 0.05, 1 / 12) - 1;
  let balance = principalWon;
  const rows: LoanScheduleRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    let payment = roundWon(firstPayment * Math.pow(1 + growth, month - 1));
    const interest = roundWon(balance * r);
    let principal = payment - interest;
    if (principal <= 0) principal = 1;
    if (month === months || principal > balance) {
      principal = balance;
      payment = principal + interest;
    }
    balance = Math.max(0, balance - principal);
    rows.push({
      month,
      paymentWon: payment,
      principalWon: principal,
      interestWon: interest,
      balanceWon: balance,
    });
  }

  const totalPaymentWon = rows.reduce((sum, row) => sum + row.paymentWon, 0);
  const totalInterestWon = rows.reduce((sum, row) => sum + row.interestWon, 0);
  return {
    input,
    rows,
    totalPaymentWon,
    totalInterestWon,
    firstMonthPaymentWon: rows[0]?.paymentWon || 0,
  };
};

export const calculateLoan = (input: LoanInput): LoanResult => {
  const normalized: LoanInput = {
    ...input,
    principalWon: clampPositive(input.principalWon),
    months: Math.floor(clampPositive(input.months)),
    annualRatePercent: clampPositive(input.annualRatePercent),
  };

  if (!normalized.principalWon || !normalized.months) {
    return {
      input: normalized,
      rows: [],
      totalPaymentWon: 0,
      totalInterestWon: 0,
      firstMonthPaymentWon: 0,
    };
  }

  switch (normalized.repaymentType) {
    case "equal-principal":
      return calcEqualPrincipal(normalized);
    case "bullet":
      return calcBullet(normalized);
    case "step-up":
      return calcStepUp(normalized);
    case "equal-payment":
    default:
      return calcEqualPayment(normalized);
  }
};

