export function New(Username, AvatarUrl, IsPublic, IsOwner){
  return{
    Username:Username, 
    AvatarUrl:AvatarUrl, 
    IsPublic:IsPublic, 
    IsOwner:IsOwner
  };
}
