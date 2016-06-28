export function getTitle (obj = {name:'missing'}) {
  return obj.name || obj.title;
}
