import Rx from 'rxjs/Rx';
import '../css/base.css';
$(() => {
  const $input = $('.search');
  const observable = Rx.Observable.fromEvent($input, 'keyup')
    .distinctUntilChanged()
    .debounce(250)
    .map(function () { return $input.val(); })
    .filter(function (text) { return !!text; });
  observable.subscribe(text => console.log(text), err => console.log(err));
});
