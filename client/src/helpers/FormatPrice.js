const exchangeRates = {
    PKR: 1, // Pakistani Rupee
    USD: 0.0036, // US Dollar
    AED: 0.013, // UAE Dirham
    SAR: 0.014, // Saudi Riyal
    OMR: 0.0014, // Omani Rial
    TRY: 0.12, // Turkish Lira
    GBP: 0.0028, // British Pound
    QAR: 0.013, // Qatari Riyal
    CAD: 0.0048, // Canadian Dollar
    EUR: 0.0033, // Euro
    AUD: 0.005, // Australian Dollar
    BDT: 0.39, // Bangladeshi Taka
    HKD: 0.028, // Hong Kong Dollar
    THB: 0.13, // Thai Baht
    NZD: 0.0053 // New Zealand Dollar
};

const currencyCodes = {
    PKR: 'PKR',
    USD: 'USD',
    AED: 'AED',
    SAR: 'SAR',
    OMR: 'OMR',
    TRY: 'TRY',
    GBP: 'GBP',
    QAR: 'QAR',
    CAD: 'CAD',
    EUR: 'EUR',
    AUD: 'AUD',
    BDT: 'BDT',
    HKD: 'HKD',
    THB: 'THB',
    NZD: 'NZD'
};

const FormatPrice = ({ price, currency }) => {
    if (typeof currency !== "string") {
        throw new TypeError(`Expected a string for currency, got: ${typeof currency}`);
    }
    if (!exchangeRates[currency]) {
        throw new RangeError(`Invalid currency code: ${currency}`);
    }
    const convertedPrice = price * exchangeRates[currency];
    
    const currencyCode = currencyCodes[currency];

    return Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
    }).format(convertedPrice);
};

export default FormatPrice;
