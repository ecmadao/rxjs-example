import Rx from 'rx';
import {
  getRepos,
  getUser
} from './helper';
import '../css/base.css';

const showNewResults = ($dom, items) => {
  const repos = items.map((item, i) => {
    return reposTemplate(item);
  }).join('');
  $dom.html(repos);
};

const reposTemplate = (repos) => {
  const {owner} = repos;
  return `<div class="repos_item">
    <div class="repos_item_wrapper">
      <div class="repos_user_container">
        <img data-api="${owner.url}" class="user_header" src="${owner.avatar_url}"/>
        <div class="user_info">
          <a class="user_link" target="_blank" href="${owner.html_url}">
            ${owner.login}
          </a> /
          <a class="repos_link" target="_blank" href="${repos.html_url}">
            ${repos.name}
          </a>
        </div>
        <div class="user_infos_container">
        </div>
      </div>
      <div class="repos_info_container">
        <div class="repos_desc">
          ${repos.description}
        </div>
        <div class="repos_info">
          <em class="repos_language">${repos.language}</em>
          <i aria-hidden="true" class="fa fa-star"></i>&nbsp;${repos.stargazers_count}&nbsp;&nbsp;
          <i aria-hidden="true" class="fa fa-eye"></i>&nbsp;${repos.watchers_count}&nbsp;&nbsp;
          <i aria-hidden="true" class="fa fa-code-fork"></i>&nbsp;${repos.forks_count}&nbsp;&nbsp;
          <i aria-hidden="true" class="fa fa-file-archive-o"></i>&nbsp;${repos.size}
        </div>
      </div>
    </div>
  </div>`;
};

const showUserInfo = ($dom, data) => {
  $dom.append(userTemplate(data));
};

const userTemplate = (user) => {
  return `<div class="user_infos_container active">
    <div class="user_infos_wrapper">
      <div>
        <i aria-hidden="true" class="fa fa-user-circle"></i>&nbsp;&nbsp;${user.name}
      </div>
      <div>
        <i aria-hidden="true" class="fa fa-map-marker"></i>&nbsp;&nbsp;${user.location}
      </div>
      <div>
        <i aria-hidden="true" class="fa fa-users"></i>&nbsp;&nbsp;${user.company}
      </div>
      <div>
        <i aria-hidden="true" class="fa fa-edge"></i>&nbsp;&nbsp;${user.blog}
      </div>
    </div>
  </div>`;
};

$(() => {
  const $conatiner = $('.content_container');
  const $input = $('.search');
  // const observable = Rx.Observable.fromEvent($input, 'keyup')
  //   .map(() => $input.val())
  //   .filter((text) => !!text)
  //   .distinctUntilChanged()
  //   .debounce(250)
  //   .flatMapLatest(getRepos);

  // observable.subscribe((data) => {
  //   showNewResults($conatiner, data);
  // }, (err) => {
  //   console.log(err);
  // }, () => {
  //   console.log('completed');
  // });

  const $avator = $('.user_header');
  const avatorMouseover = Rx.Observable.fromEvent($avator, 'mouseover')
    .map(function(e) {
      const $userContainer = $(e.target).parent();
      const $userInfosContainer = $userContainer.find('.user_infos_container');
      if ($userInfosContainer.length) {
        $userInfosContainer.addClass('active');
        return {
          conatiner: $userContainer,
          url: null
        };
      }
      return {
        conatiner: $userContainer,
        url: $(e.target).attr('data-api')
      }
    })
    .filter((data) => !!data.url)
    .distinctUntilChanged()
    .debounce(250)
    .flatMapLatest(getUser);

  avatorMouseover.subscribe((result) => {
    const {data, conatiner} = result;
    showUserInfo(conatiner, data);
  }, (err) => {
    console.log(err);
  }, () => {
    console.log('completed');
  });

  const avatorMouseout = Rx.Observable.fromEvent($avator, 'mouseout')
    .map(function(e) {
      const $userInfosContainer = $(e.target).parent().find('.user_infos_container');
      if ($userInfosContainer.length) {
        $userInfosContainer.removeClass('active');
      }
    }).subscribe();
});
