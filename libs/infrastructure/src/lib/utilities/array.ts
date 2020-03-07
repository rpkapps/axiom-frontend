// Removes item from array if it exist, otherwise add it to the array
export function toggleItemInArray(array: any[], item: any) {
  const index = array.indexOf(item);
  if (index === -1) {
    array.push(item);
  } else {
    array.splice(index, 1);
  }
}
