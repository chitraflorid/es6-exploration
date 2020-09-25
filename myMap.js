Array.prototype.myMap = function(callback, thisObj) {
  const inputArr = this;
  const res = [];
  const thisP = thisObj ? thisObj : this;
  for (let i = 0; i < inputArr.length; i++) {
    res.push(callback.call(thisP, inputArr[i], i, inputArr))
  }
  
  return res;
};
