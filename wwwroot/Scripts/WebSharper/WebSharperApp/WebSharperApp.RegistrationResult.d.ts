export function Error(Item:string):RegistrationResult
export interface Success {
  $:0;
}
export interface Error_1 {
  $:1;
  $0:string;
}
export type RegistrationResult = (Success | Error_1)
