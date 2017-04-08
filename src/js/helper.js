import Rx from 'rx';
import { polyfill } from 'es6-promise';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { TOKEN } from './const_value';
polyfill();

const SEARCH_REPOS = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=';
const KB2MB = 0.0009765625;
const KB2BYTES = 1024;

const formatRepoSize = (repoSize) => {
  return parseInt(repoSize).toFixed(2);
};

export const formatRepoSizeAndUnit = (repoSize) => {
  if (repoSize < 1) {
    return [formatRepoSize(repoSize * KB2BYTES), 'Bytes'];
  }
  if (repoSize >= 1 / KB2MB) {
    return [formatRepoSize(repoSize * KB2MB), 'MB'];
  }
  return [repoSize, 'KB'];
};

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

const getUserPromise = (data) => {
  const { url, conatiner } = data;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `${url}?access_token=${TOKEN}`,
      success: (data) => {
        resolve({
          conatiner,
          data
        });
      },
      error: (err) => {
        console.log(err);
        reject(null);
      }
    });
  });
};

export const getRepos = (query) => {
  const promise = getReposPromise(query);
  return Rx.Observable.fromPromise(promise);
};

export const getUser = (data) => {
  const promise = getUserPromise(data);
  return Rx.Observable.fromPromise(promise);
};
