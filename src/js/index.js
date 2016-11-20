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
  initialUserInfoSteam();
};

const reposTemplate = (repos) => {
  const {owner} = repos;
  return `<div class="repos_item">
    <div class="repos_item_wrapper">
      <div class="repos_user_container">
        <div class="user_header_container">
          <img data-api="${owner.url}" class="user_header" src="${owner.avatar_url}"/>
          <div class="user_infos_container">
            <div class="user_infos_wrapper">
              <div class="info_loading">
                <i aria-hidden="true" class="fa fa-spinner fa-spin"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="user_info">
          <a class="user_link" target="_blank" href="${owner.html_url}">
            ${owner.login}
          </a> /
          <a class="repos_link" target="_blank" href="${repos.html_url}">
            ${repos.name}
          </a>
        </div>
      </div>
      <div class="repos_info_container">
        <div class="repos_desc">
          ${repos.description}
        </div>
        <div class="repos_info">
          <em class="repos_language">${repos.language || ''}</em>
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
  $dom.html(userTemplate(data));
};

const userTemplate = (user) => {
  return `<div class="infos_container">
    <div class="info_container">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-user-circle"></i>
      </div>&nbsp;&nbsp;${user.name}
    </div>
    ${user.location ? `<div class="info_container">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-map-marker"></i>
      </div>&nbsp;&nbsp;${user.location}
    </div>` : ''}
    ${user.email ? `<a class="info_container" href="mailto:${user.email}">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-envelope-o"></i>
      </div>&nbsp;&nbsp;${user.email}
    </a>` : ''}
    ${user.company ? `<div class="info_container">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-users"></i>
      </div>&nbsp;&nbsp;${user.company}
    </div>` : ''}
    ${user.blog ? `<a class="info_container" target="_blank" href="${user.blog}">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-chrome"></i>
      </div>&nbsp;&nbsp;${user.blog}
    </a>` : ''}
    ${user.bio ? `<div class="info_container info_bio">
      <div class="info_icon">
        <i aria-hidden="true" class="fa fa-quote-left"></i>
      </div>&nbsp;&nbsp;${user.bio}
    </div>` : ''}
    <div class="info_container info_social">
      <i aria-hidden="true" class="fa fa-cube"></i>&nbsp;${user.public_repos}&nbsp;&nbsp;
      <i aria-hidden="true" class="fa fa-user-plus"></i>&nbsp;${user.followers}&nbsp;&nbsp;
    </div>
  </div>`;
};

const initialUserInfoSteam = () => {
  const $avator = $('.user_header');
  const avatorMouseover = Rx.Observable.fromEvent($avator, 'mouseover')
    .map(function(e) {
      const $userContainer = $(e.target).parent();
      const $infosContainer = $userContainer.find('.user_infos_container');
      const $infosWrapper = $infosContainer.find('.user_infos_wrapper');
      $infosContainer.addClass('active');
      if ($infosWrapper.find('.infos_container').length) {
        return {
          conatiner: $infosWrapper,
          url: null
        };
      }
      return {
        conatiner: $infosWrapper,
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

  Rx.Observable.fromEvent($avator, 'mouseout')
    .map(function(e) {
      const $infosContainer = $(e.target).parent().find('.user_infos_container');
      $infosContainer.removeClass('active');
    }).subscribe();
};

$(() => {
  const $conatiner = $('.content_container');
  const $input = $('.search');
  const observable = Rx.Observable.fromEvent($input, 'keyup')
    .map(() => $input.val())
    .filter((text) => !!text)
    .distinctUntilChanged()
    .debounce(250)
    .flatMapLatest(getRepos);

  observable.subscribe((data) => {
    showNewResults($conatiner, data);
  }, (err) => {
    console.log(err);
  }, () => {
    console.log('completed');
  });
});
