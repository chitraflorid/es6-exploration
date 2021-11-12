const prom = new MyPromise((resolve, reject) => {
    try {
    
      // do some async operation
    
      resolve(result);
      
      } catch(err) {
        reject(err);
      }
   
});

Promise represents an eventual result of an asynchronous operation. 
It can be in the following states such as pending, fullfilled and rejected.

The constructor accepts a function as it's argument. 
This is the executor function which would accept 2 aguments such as resolve and reject.
Executor's responsibility is to call either resolve or reject based on the outcome of the associated asynchornous operation defined in it.
Both the resolve and reject would be passed by the Promise to this Executor function.

then method:
============

As per Promises/A+ specification, then method should always return a new promise instance. 

It will accept 2 arguments namely onFullfillHandler and onRejectHandle.

Multiple  then's can be attached to the same promise.

The callback handlers should not be called before promise is settled. 

Once it's settled, it's state / value can't be transformed.

The  callbacks provided by then methods would be stored and invoked in their originating order once the associated promise is settled.

Promise resolution behavior:
============================

if Promise is fullfilled, then the associated onFullfillHandlers would be invoked one by one by passing the value of the promise.

If the onFullfillHandler is provided , it would be called with the promise's value.

If the returned value by onFullfillHandler is thenable

    ( a promise-like Object with then method defined in it ), 
    the chainable promise (returned by the then method in which currently executing onFullfillHandler was passed) would be settled with the                      value / reason of this thenable promise.

   If not thenable, then the chainable promise would be resolved with itself.
   
 If there is no onFullfillHandler provided, then the associated chainable promsie woudld be resolved with the promise's value itself.
 
 The similar procedure would be applicable for onRejectHandler with the promise's reason.




