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