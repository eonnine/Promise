# Promise
Promise

Promise
=
Promise를 구현해본 예제입니다.

### ※Promise.then

가장 기본적인 프로미스입니다. 순차적으로 실행됩니다.
각 프로미스 함수는 3개의 파라미터를 가집니다.
- resolve: 다음 프로미스 함수를 실행합니다. 이 함수의 인자는 다음 프로미스 함수의 세번째 파라미터로 전달됩니다.
- reject: 프로미스를 종료합니다. 남은 프로미스 함수들은 실행되지 않고 제거됩니다.
- data: 이전 프로미스 함수에서 resolve함수의 인자로 넘긴 파라미터입니다.  

<br/>

만약 error함수로 catch함수를 정의했다면 
프로미스 함수 실행 중 에러가 발생하거나 reject되었을 때 catch함수가 실행됩니다. 
catch함수는 type과 data, 두 개의 파라미터를 가집니다.  

<br/>

```javascript
var promise = new Promise();

promise.error(function (type, data) {
	console.log(type, data); // 'reject', 'error!'
});

promise
.then(function (resolve, reject) {
	var num = 0;
	resolve(num); 
})
.then(function (resolve, reject, data) {
	console.log(data); // 0
	resolve(++data);
});

promise.then(function (resolve, reject, data) {
	console.log(data); // 1
	reject('error!'); // error함수로 정의한 catch함수가 실행됩니다.
});

// 이전 프로미스 함수에서 reject했으므로 실행되지 않습니다.
promise.then(function (resolve, reject, data) { 
	console.log(data);
});
```


### ※Promise.all
배열에 담긴 프로미스 함수들이 실행되고 전부 resolve되면 메인 함수가 실행됩니다.
반대로, 하나의 프로미스 함수라도 reject되면 메인 함수는 실행되지 않습니다.
각 프로미스 함수는 resolve와 reject, 두 개의 파라미터를 가집니다.

만약 errorAll함수로 catch함수를 정의했다면 
메인 함수 실행 중 에러가 발생하거나 reject되었을 때 catch함수가 실행됩니다. 
catch함수는 type과 data, 두 개의 파라미터를 가집니다.

- type: 'reject' | 'error'
- data: type이 'reject'인 경우 reject를 호출할 때 인자로 넘긴 값이며 'error'인 경우 error 객체입니다. 

```javascript
var promise = new Promise();

Promise.errorAll(function (type, data) {
	console.log(type, data); // 'reject', 'error!'
});

promise.all([
	promiseFirstFn,
	promiseSecondFn,
	promiseThirdFn
], function () {
	console.log('success');
});

function promiseFirstFn (resolve, reject) {
	resolve();
}
function promiseSecondFn (resolve, reject) {
	resolve();
}
function promiseThirdFn (resolve, reject) {
	reject('error!');
}
```


### ※Promise.one
메인 함수가 실행되는 동안 add함수로 추가된 프로미스 함수들을 큐에 쌓아갑니다.

메인 함수가 resolve되면 큐에 쌓였던 함수들을 전부 실행하고 이후 새로 추가되는 함수들은 즉시 실행됩니다.
큐가 비워진 후 새로 추가되는 함수들은 프로미스 방식으로 실행되지 않습니다. 즉, 순서를 보장하지 않습니다.
큐에 들어있는 함수가 없을 때 새로운 메인 함수가 추가된다면 다시 위 방식으로 동작합니다.

메인 프로미스 함수는 resolve, 단 하나의 파라미터를 가집니다.
resolve함수의 인자로 넘긴 값은 resolve 후 실행되는 함수(큐에 쌓였있던 함수)들의 파라미터로 전달됩니다.
 
```javascript
var promise = new Promise();

promise.one(function (resolve) {
	setTimeout(function () {
		resolve(1);
	}, 500);
});

promise.add(function (data) {
	console.log(data); // 1
});

promise
.add(function (data) {
	console.log(data); // 1
})
.add(function (data) {
	console.log(data); // 1
});
```
