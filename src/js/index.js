import Rx from 'rx';
import {getRepos} from './helper';
import '../css/base.css';

$(() => {
  const $input = $('.search');
  const observable = Rx.Observable.fromEvent($input, 'keyup')
    .debounce(250)
    .map(function () { return $input.val(); })
    .filter(function (text) { return !!text; })
    .distinctUntilChanged()
    .flatMapLatest(getRepos);

  observable.subscribe((data) => {
    console.log(data);
  }, (err) => {
    console.log(err);
  }, () => {
    console.log('completed');
  });
});
