import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
export function New(Username, AvatarUrl, IsPublic, IsOwner)
export default interface PublicProfile {
  Username:string;
  AvatarUrl:FSharpOption<string>;
  IsPublic:boolean;
  IsOwner:boolean;
}
