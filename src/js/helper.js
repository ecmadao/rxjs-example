// import Rx from 'rxjs/Rx';
import Rx from 'rx';
import {polyfill} from 'es6-promise';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {TOKEN} from './const_value';
polyfill();

const SEARCH_REPOS = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=';

const getReposPromise = (query) => {
  return new Promise((resolve, reject) => {
    NProgress.start();
    NProgress.set(0.4);
    $.ajax({
      type: "GET",
      url: `${SEARCH_REPOS}${query}`,
      success: (data) => {
        NProgress.done();
        resolve(data.items);
      },
      error: (err) => {
        console.log(err);
        NProgress.done();
        resolve([]);
      }
    });
  });
};

export const getRepos = (query) => {
  const promise = getReposPromise(query);
  return Rx.Observable.fromPromise(promise);
};
