const STATE = {
    PENDING: 'pending',
    FULLFILLED: 'fullfilled',
    REJECTED: 'rejected'
};

class MyPromise {
    _state = STATE.PENDING;
    _value = null;
    _reason = null;
    _thenQ = [];

    constructor(executor) {
        try {
            executor(this._resolver.bind(this), this._rejector.bind(this));
        } catch(err) {
            
        }
    }

    static isThenable(obj) {
        const type = typeof obj;
        return type !== null && type === "object" && obj.hasOwnProperty("then");
    }

    _resolver(result) {
        this._value = result;
        this._state = STATE.FULLFILLED;
        
        this._runOnFullfillSubscribers();
    }

    _rejector(reason) {
        this._reason = reason;
        this.state = STATE.REJECTED;
        
        this._runOnRejectSubscribers();
    }

    _runOnFullfillSubscribers() {
        if (this._state === STATE.PENDING) return;
        
        this._thenQ.forEach(([chainablePromise, onFullfillHandler]) => {
            if (typeof onFullfillHandler === "function") {
                const result = onFullfillHandler(this._value);
                
                if (MyPromise.isThenable(result)) {
                    result.then(val => chainablePromise._resolver(val), reason => chainablePromise._rejector(reason));
                } else {
                    chainablePromise._resolver(result);
                }
            } else {
                chainablePromise._resolver(this._value);
            }
            
        });
        
        this._thenQ = [];
    }

    _runOnRejectubscribers() {
        if (this._state === STATE.PENDING) return;
        
        this._thenQ.forEach(([chainablePromise, _, onRejectHandler]) => {
            if (typeof onRejectHandler === "function") {
                const result = onRejectHandler(this._reason);
                
                if (MyPromise.isThenable(result)) {
                    result.then(val => chainablePromise._resolver(val), reason => chainablePromise._rejector(reason));
                } else {
                    chainablePromise._rejector(result);
                }
            } else {
                chainablePromise._rejector(this._value);
            }
            
        });
        
        this._thenQ = [];
    }

    then(onFullfillHandler, onRejectHandler) {
        const chaninablePromise = new MyPromise();
        
        this._thenQ.push([chaninablePromise, onFullfillHandler, onRejectHandler]);
        
        if (this._state !== STATE.PENDING) {
            this._value && this._runOnFullfillSubscribers();
            
            this._reason && this._runOnRejectSubscribers();
        }
    }

    catch(onRejectHandler) {
        this.then(null, onRejectHandler);
    }

    static all(promiseArr) {
        const result = [];
        let rejected;
        if (!Array.isArray(promiseArr)) {
            throw new Error("Input should be an Array!");
        }
        
        return new MyPromise((resolve, reject) => {
           for (let i = 0; i < promiseArr.length; i++) {
               if (rejected !== undefined) {
                   return reject(rejected);
               }
               
               promiseArr[i].then(res => {
                   result.push(res);
                   if (i === promiseArr.length-1) {
                        resolve(result);   
                   }
               })
               .catch(err => reject(err));
           } 
            
        });
    }

    static race(promiseArr) {
        let result;
        
        if (!Array.isArray(promiseArr)) {
            throw new Error("Input should be an Array!");
        }
        
        return new MyPromise((resolve, reject) => {
           MyPromise.forEach((promise, indx) => {
              promise.then(res => resolve(res)).catch(err => reject(err)); 
           });
        });        
    }    

    static allSettled(promiseArr) {
        const result = [];
        if (!Array.isArray(promiseArr)) {
            throw new Error("Input should be an Array!");
        }
        
        return new MyPromise((resolve, reject) => {
           for (let i = 0; i < promiseArr.length; i++) {
               promiseArr[i].then(res => {
                   result.push(res);
                   if (i === promiseArr.length - 1) {
                     resolve(result); 
                   }
               }, 
              reason => {
                   result.push(reason);
                   if (i === promiseArr.length - 1) {
                     resolve(result); 
                   }
               });   
           }
        });
    }
} // in-progress
