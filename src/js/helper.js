import Rx from 'rxjs/Rx';
import {polyfill} from 'es6-promise';
import {TOKEN} from './const_value';
polyfill();

const SEARCH_REPOS = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=';

const getReposPromise = (query) => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve('resolved');
    // }, 2000);
    $.ajax({
      type: "GET",
      url: `${SEARCH_REPOS}${query}`,
      // headers: {
      //   'User-Agent': 'rxjs-github-example'
      // },
      success: (data) => {
        resolve(data.items);
      },
      error: (err) => {
        console.log(err);
        reject(false);
      }
    });
  });
};

export const getRepos = (query) => {
  const promise = getReposPromise(query);
  return Rx.Observable.fromPromise(promise);
};
