export type CheckoutField =
  | "email"
  | "name"
  | "phone"
  | "address"
  | "postalCode"
  | "city"
  | "province"
  | "holder"
  | "cardNumber"
  | "expiry"
  | "cvc"
  | "rememberPayment";

export type CheckoutValues = {
  email: string;
  name: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  holder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  rememberPayment: boolean;
};

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;
