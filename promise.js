(function (factory) {
  if( typeof define == 'function' && define.amd ){
    define(function () {
      return factory;
    });
  } else if( typeof module == 'object' && typeof module.export == 'object' ){
    module.exports = factory;
  } else {
    window['Promise'] = factory;
  }
}(function () {
  function Promise () {
    // then
    this.isIng = false;
    this.queue = [];
    this.errorFn = null;
    
    // all
    this.resolvedCount = 0;
    this.allCompleteFn = null;
    this.allErrorFn = null;
    
    // one
    this.afterQueue = [];
    this.isWait = false;
 }
 

 /**
  * Promise Then 구현
  */
 Promise.prototype.then = function (fn) {
    this.queue.push(fn);
    this.run();
    return this;
 }
 
 Promise.prototype.run = function (data) {
    if( !this.isIng && this.queue.length > 0 ){
       this.isIng = true;
       try {
          this.queue.shift()(this.makeResolve(), this.makeReject(), data);
       } catch (e) {
          this.errorFn('error', e);
       }
    }
 }
 
 Promise.prototype.makeResolve = function () {
    return function resolve (data) {
       this.isIng = false;
       this.run(data);
    }.bind(this);
 }
 
 Promise.prototype.makeReject = function () {
    return function reject (data) {
       if( this.errorFn != null ){
          this.errorFn('reject', data);
       }
       this.isIng = false;
       this.queue = [];
    }.bind(this);
 }
 
 Promise.prototype.error = function (fn) {
    this.errorFn = fn;
    return this;
 }
 

 /**
  * Promise All 구현
  */
 Promise.prototype.all = function (fnArray, callBack) {
    var _this = this;
    this.allCompleteFn = callBack;
    fnArray.forEach(function (fn) {
       _this.resolvedCount++;
       try {
          fn(_this.makePromiseAllResolve(), _this.makePromiseAllReject());
       } catch (e) {
          this.allErrorFn('error', e);
       }
    });
    return this;
 }
 
 Promise.prototype.makePromiseAllResolve = function () {
    return function promiseAllResolve () {
       if( this.allCompleteFn != null ){
          this.resolvedCount--;
          if(this.resolvedCount == 0){
             this.allCompleteFn();
             this.allCompleteFn = null;
          }
       }
    }.bind(this);
 }
 
 Promise.prototype.makePromiseAllReject = function () {
    return function promiseAllReject (data) {
       if( this.allErrorFn ){
          this.allErrorFn('reject', data);
       }
       this.resolvedCount = 0;
       this.allCompleteFn = null;
    }.bind(this);
 }
 
 Promise.prototype.errorAll = function (fn) {
    this.allErrorFn = fn;
    return this;
 }
 
 
 /**
  * Promise One 구현
  */
 Promise.prototype.one = function (callBack) {
    this.isWait = true;
    callBack(this.makePromiseOneResolve());
    return this;
 }
 
 Promise.prototype.add = function (fn) {
    if( this.isWait ){
       this.afterQueue.push(fn);
    } else {
       fn();
    }
    return this;
 }
 
 Promise.prototype.makePromiseOneResolve = function () {
    return function promiseOneResolve (data) {
       this.isWait = false;
       while( this.afterQueue.length > 0 ){
          this.afterQueue.shift()(data);
       }
    }.bind(this);
 }
 
 return Promise;
}()));