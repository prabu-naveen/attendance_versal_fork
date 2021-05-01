export const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties,
});

export const insertElementInArray = (oldObject, propertyName, data) => ({
  ...oldObject,
  [propertyName]: oldObject[propertyName].concat(data),
});

export const updateObjectInArray = (array, action) => array.map((item) => {
  if (item.key !== action.key) {
    // This isn't the item we care about - keep it as-is
    return item;
  }
  // Otherwise, this is the one we want - return an updated value
  return {
    ...item,
    ...action.element,
  };
});
