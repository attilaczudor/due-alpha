import { DecodeUnion, Id, EncodeRecord, DecodeRecord, EncodeDateTime, DecodeDateTime } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
let Encoder_GlobalSettings;
let Decoder_AuthResult;
let Decoder_GlobalSettings;
let Encoder_MealPlanItem;
let Decoder_MealPlanItem;
let Encoder_DailyRecord;
let Decoder_DailyRecord;
let Encoder_CalendarEvent;
let Decoder_CalendarEvent;
export function DecodeJson_AuthResult(){
  return Decoder_AuthResult?Decoder_AuthResult:Decoder_AuthResult=(DecodeUnion(void 0, "$", [[0, [["$0", "Item", Id(), 0]]], [1, [["$0", "Item1", Id(), 0], ["$1", "Item2", Id(), 0]]], [2, []], [3, [["$0", "Item", Id(), 0]]]]))();
}
export function EncodeJson_GlobalSettings(){
  return Encoder_GlobalSettings?Encoder_GlobalSettings:Encoder_GlobalSettings=(EncodeRecord(void 0, [["CalendarStartDay", Id(), 0], ["AvatarUrl", Id(), 1]]))();
}
export function DecodeJson_GlobalSettings(){
  return Decoder_GlobalSettings?Decoder_GlobalSettings:Decoder_GlobalSettings=(DecodeRecord(void 0, [["CalendarStartDay", Id(), 0], ["AvatarUrl", Id(), 1]]))();
}
export function EncodeJson_MealPlanItem(){
  return Encoder_MealPlanItem?Encoder_MealPlanItem:Encoder_MealPlanItem=(EncodeRecord(void 0, [["Id", Id(), 0], ["PlanDate", EncodeDateTime(), 0], ["MealType", Id(), 0], ["RecipeId", Id(), 1], ["Title", Id(), 0], ["Notes", Id(), 0]]))();
}
export function DecodeJson_MealPlanItem(){
  return Decoder_MealPlanItem?Decoder_MealPlanItem:Decoder_MealPlanItem=(DecodeRecord(void 0, [["Id", Id(), 0], ["PlanDate", DecodeDateTime(), 0], ["MealType", Id(), 0], ["RecipeId", Id(), 1], ["Title", Id(), 0], ["Notes", Id(), 0]]))();
}
export function EncodeJson_DailyRecord(){
  return Encoder_DailyRecord?Encoder_DailyRecord:Encoder_DailyRecord=(EncodeRecord(void 0, [["Id", Id(), 0], ["RecordDate", EncodeDateTime(), 0], ["Type", Id(), 0], ["Value", Id(), 0], ["Unit", Id(), 0], ["Status", Id(), 0]]))();
}
export function DecodeJson_DailyRecord(){
  return Decoder_DailyRecord?Decoder_DailyRecord:Decoder_DailyRecord=(DecodeRecord(void 0, [["Id", Id(), 0], ["RecordDate", DecodeDateTime(), 0], ["Type", Id(), 0], ["Value", Id(), 0], ["Unit", Id(), 0], ["Status", Id(), 0]]))();
}
export function EncodeJson_CalendarEvent(){
  return Encoder_CalendarEvent?Encoder_CalendarEvent:Encoder_CalendarEvent=(EncodeRecord(void 0, [["Id", Id(), 0], ["Title", Id(), 0], ["Description", Id(), 0], ["EventDate", EncodeDateTime(), 0], ["EventType", Id(), 0], ["Icon", Id(), 0]]))();
}
export function DecodeJson_CalendarEvent(){
  return Decoder_CalendarEvent?Decoder_CalendarEvent:Decoder_CalendarEvent=(DecodeRecord(void 0, [["Id", Id(), 0], ["Title", Id(), 0], ["Description", Id(), 0], ["EventDate", DecodeDateTime(), 0], ["EventType", Id(), 0], ["Icon", Id(), 0]]))();
}
