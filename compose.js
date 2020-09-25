function compose(middleware) {
  let i = middleware.length - 1;
  let fn;
  let cb;
  
  return function() {
    while( i >= 0) {
      fn = middleware[i];

      if (fn && fn.length) {
        cb = fn.bind(null, cb ? cb : middleware[i-1]);
      } else {
        cb = fn.bind(null);
      }
      i--;
    }

    cb();
  }

}

/**
let middleware = []
middleware.push((next) => {
 console.log(1)
 next()
 console.log(1.1)
})
middleware.push((next) => {
 console.log(2)
 next()
 console.log(2.1)
})
middleware.push(() => {
    console.log(3)
})
let fn = compose(middleware)
fn();


o/p:
1
2
3
2.1
1.1
**/
