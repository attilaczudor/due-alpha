export function Error(Item:string):AuthResult
export function LoggedIn(Item1:string, Item2:boolean):AuthResult
export function Success(Item:boolean):AuthResult
export interface Success {
  $:0;
  $0:boolean;
}
export interface LoggedIn {
  $:1;
  $0:string;
  $1:boolean;
}
export interface NeedPasswordChange {
  $:2;
}
export interface Error_1 {
  $:3;
  $0:string;
}
export type AuthResult = (Success | LoggedIn | NeedPasswordChange | Error_1)
