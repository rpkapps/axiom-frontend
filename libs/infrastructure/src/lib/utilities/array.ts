// Removes item from array if it exist, otherwise add it to the array
export function toggleItemInArray(array: any[], item: any) {
  const index = array.indexOf(item);
  if (index === -1) {
    array.push(item);
  } else {
    array.splice(index, 1);
  }
}

export function removeFromArrayByValue(array: any[], value: any) {
  array = array || [];
  const index = array.indexOf(value);

  if (index !== -1) {
    array.splice(index, 1);
    return true;
  }

  return false;
}

export function removeDuplicateItemsFromArray(array: any[]) {
  return [...new Set(array)];
}
