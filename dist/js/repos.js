// TODO: Consider all those additional classes like repo-lang-icon
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
                isArchived
              }
            }
          }
        }`
      })
    });

    const parsed = parse(result.data.user.repositories.nodes);

    for(let i in parsed) {
      const repoInfo = parsed[i];
      const $repo = $('<div class="repo border rounded-sm">');

      const $name = $('<a class="repo-name font-weight-bold">').attr('href', repoInfo.url).html(repoInfo.owner + ' / ' + repoInfo.name);
      $repo.append($name);

      if(repoInfo.homepageUrl) {
        $repo.append($('<span class="separator">'));
        const ref = $('<a class="text-reset">').html('Project page').attr('href', repoInfo.homepageUrl);
        $repo.append($('<span class="repo-page text-muted">').append(ref));
      }

      const description = $('<p class="repo-desc">').html(repoInfo.description);
      $repo.append(description);

      const $misc = $('<div class="repo-misc">');

      const $langIcon = $('<i class="fa fa-circle repo-lang-icon text-primary" aria-hidden="true">');
      const $lang = $('<span>').html(repoInfo.language);
      $misc.append($langIcon).append($lang);

      const starCount = repoInfo.stargazerCount;
      if(starCount > 0) {
        const $starIcon = $('<i class="fa fa-star repo-star-icon" aria-hidden="true">');
        const $stars = $('<span class="repo-misc-stars">').html(starCount);
        $misc.append($starIcon).append($stars);
      }

      const forkCount = repoInfo.forkCount;
      if(forkCount > 0) {
        const $forkIcon = $('<i class="fa fa-code-branch repo-fork-icon" aria-hidden="true">');
        const $forks = $('<span class="repo-misc-forks">').html(forkCount);
        $misc.append($forkIcon).append($forks);
      }

      $repo.append($misc);

      $('.repos').append($repo);
    }

    $(document).ready(() => {
      $('.fadein-placeholder').fadeOut(() => {
        $('.fadein').fadeIn();
      });
    });
  }

  const parse = (repos) => {
    return repos.filter(r => isViewable(r)).map(r => ({
      owner: r.owner.login,
      name: r.name,
      description: r.description,
      url: r.url,
      homepageUrl: r.homepageUrl,
      language: r.primaryLanguage.name,
      stargazerCount: r.stargazers.totalCount,
      forkCount: r.forks.totalCount,
    }));
  }

  const isViewable = (repo) => {
    return !isNoShow(repo) && !isArchived(repo);
  }

  const isNoShow = (repo) => {
    return repo.repositoryTopics.nodes.map(n => n.topic.name).indexOf('noshow') >= 0;
  }

  const isArchived = (repo) => {
    return repo.isArchived;
  }

  fetchRepoData();
}();
