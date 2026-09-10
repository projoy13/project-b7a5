export type Role="ADMIN" |"PROVIDER" |"CUSTOMER"
export type LoginState={
    success:boolean
    message:string
}
export type User={
    id:string,
    name:string,
    email:string,
    role:Role
}
export type GearCategory = {
  id: string;
  name: string;
};

export type Gear = {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number | string;
  stock?: number;
  status?: string;
  image?: string | null;
  category?: GearCategory | string;
};