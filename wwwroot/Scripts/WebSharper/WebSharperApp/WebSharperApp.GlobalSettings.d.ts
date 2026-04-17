import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
export function New(Username, Email, PendingEmail, CalendarStartDay, AvatarUrl, IsProfilePublic)
export default interface GlobalSettings {
  Username:string;
  Email:string;
  PendingEmail:FSharpOption<string>;
  CalendarStartDay:string;
  AvatarUrl:FSharpOption<string>;
  IsProfilePublic:boolean;
}
