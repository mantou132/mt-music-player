export function mergeObject(obj1, obj2) {
  const obj = {};
  const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)));
  keys.forEach((key) => {
    if (!(key in obj1)) {
      obj[key] = obj2[key];
    } else if (!(key in obj2)) {
      obj[key] = obj1[key];
    } else if (obj2[key].constructor === Object) {
      obj[key] = mergeObject(obj1[key], obj2[key]);
    } else {
      obj[key] = obj2[key];
    }
  });

  return obj;
}

export const a = 1;
