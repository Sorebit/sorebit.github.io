'use strict';

+function() {
  async function fetchRepoData() {
    let result = await $.ajax({
      method: "POST",
      url: "https://api.github.com/graphql",
      contentType: "application/json",
      headers: {
        Authorization: "bearer 1f6a6e3ee94930ac5edd811e33581e9abacc2271"
      },
      data: JSON.stringify({
        query: `query {
          user(login: "sorebit") {
            repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
              nodes {
                owner { login }
                name
                description
                url
                homepageUrl
                primaryLanguage { name }
                repositoryTopics(first: 10) {
                  nodes { topic { name } }
                }
                stargazers { totalCount }
                forks { totalCount }
              }
            }
          }
        }`
      })
    });

    const parsed = parse(result.data.user.repositories.nodes);

    for(let i in parsed) {
      const repoInfo = parsed[i];
      const $repo = $('<div class="repo">');

      const $name = $('<a class="repo-name">').attr('href', repoInfo.url).html(repoInfo.owner + ' / ' + repoInfo.name);
      $repo.append($name);

      if(repoInfo.homepageUrl) {
        $repo.append($('<span class="repo-misc-separator">'));
        const ref = $('<a>').html('Project page').attr('href', repoInfo.homepageUrl);
        $repo.append($('<p class="repo-page">').append(ref));
      }

      const description = $('<p class="repo-desc">').html(repoInfo.description);
      $repo.append(description);

      const $misc = $('<div class="repo-misc">');

      const $langIcon = $('<i class="fa fa-circle repo-lang-icon" aria-hidden="true">');
      const $lang = $('<p>').html(repoInfo.language);
      $misc.append($langIcon).append($lang);

      const starCount = repoInfo.stargazerCount;
      if(starCount > 0) {
        const $starIcon = $('<i class="fa fa-star repo-star-icon" aria-hidden="true">');
        const $stars = $('<p class="repo-misc-stars">').html(starCount);
        $misc.append($starIcon).append($stars);
      }

      const forkCount = repoInfo.forkCount;
      if(forkCount > 0) {
        const $forkIcon = $('<i class="fa fa-code-branch repo-fork-icon" aria-hidden="true">');
        const $forks = $('<p class="repo-misc-forks">').html(forkCount);
        $misc.append($forkIcon).append($forks);
      }

      $repo.append($misc);

      $('.repos').append($repo);
    }

    $(document).ready(() => {
      $('.main').fadeIn();
    });
  }

  function parse(repos) {
    return repos.filter(r => !isNoShow(r)).map(r => ({
      owner: r.owner.login,
      name: r.name,
      description: r.description,
      url: r.url,
      homepageUrl: r.homepageUrl,
      language: r.primaryLanguage.name,
      stargazerCount: r.stargazers.totalCount,
      forkCount: r.forks.totalCount
    }));
  }

  function isNoShow(repo) {
    return repo.repositoryTopics.nodes.map(n => n.topic.name).indexOf('noshow') >= 0;
  }

  fetchRepoData();
}();
