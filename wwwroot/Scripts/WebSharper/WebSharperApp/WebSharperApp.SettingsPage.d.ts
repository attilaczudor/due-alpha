export interface General {
  $:0;
}
export interface Account {
  $:1;
}
export interface Health {
  $:2;
}
export interface Other {
  $:3;
}
export type SettingsPage = (General | Account | Health | Other)
