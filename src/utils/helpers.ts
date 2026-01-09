export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};

export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
};

export const getCurrentDate = (): string => {
    return new Date().toLocaleDateString();
};