export const Currencies = [
    {value:"USD", label:"$ Dollar", locale: "en-US"},
    {value:"BRL", label:"R$ Real", locale: "pt-BR"},
    {value:"EUR", label:"€ Euro", locale: "de-DE"},
    {value:"GBP", label:"£ Pound", locale: "en-GB"},
]

export type Currency = (typeof Currencies)[0]