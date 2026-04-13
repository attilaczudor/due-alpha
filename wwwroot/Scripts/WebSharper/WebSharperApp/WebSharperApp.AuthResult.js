export function Error(Item){
  return{$:3, $0:Item};
}
export function LoggedIn(Item1, Item2){
  return{
    $:1, 
    $0:Item1, 
    $1:Item2
  };
}
export function Success(Item){
  return{$:0, $0:Item};
}
export let NeedPasswordChange={$:2};
