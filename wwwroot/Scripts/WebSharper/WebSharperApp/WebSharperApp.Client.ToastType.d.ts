export interface Success {
  $:0;
}
export interface Error_1 {
  $:1;
}
export interface Warning {
  $:2;
}
export interface Info {
  $:3;
}
export type ToastType = (Success | Error_1 | Warning | Info)
