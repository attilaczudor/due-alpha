export function New(Username, Email, PendingEmail, CalendarStartDay, AvatarUrl, IsProfilePublic){
  return{
    Username:Username, 
    Email:Email, 
    PendingEmail:PendingEmail, 
    CalendarStartDay:CalendarStartDay, 
    AvatarUrl:AvatarUrl, 
    IsProfilePublic:IsProfilePublic
  };
}
