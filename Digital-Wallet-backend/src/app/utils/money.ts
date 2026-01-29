

// utils/money.ts
export const toPaisa = (amountINR: number) => Math.round(amountINR * 100);
export const fromPaisa = (amountPaisa: number) => amountPaisa / 100;
