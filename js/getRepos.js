'use strict';

var notInterested = ['sorebit.github.io', 'YtCrawler', 'node-online-game-template', 'iris-light-sorebit', 'AST'];

$.getJSON('https://api.github.com/users/Sorebit/repos', function(data) {
	for(var i in data) {
		// Hand-specified repos to not show
		if(notInterested.indexOf(data[i].name) >= 0)
			continue;

		var repo = $('<div class="repo">');
		// Repo's name
		var name = $('<a class="repo-name">');
		name.attr('href', data[i].html_url);
		name.html(data[i].owner.login + ' / ' + data[i].name);
		repo.append(name);

		// Repo's description
		var description = $('<p class="repo-desc">');
		description.html(data[i].description);
		repo.append(description);

		// Repo's misc info - language, stars, forks
		var misc = $('<div class="repo-misc">');

		var langIcon = $('<i class="fa fa-circle repo-lang-icon" aria-hidden="true">');
		var lang = $('<p>');
		lang.html(data[i].language);
		misc.append(langIcon);
		misc.append(lang);

		var starIcon = $('<i class="fa fa-star repo-star-icon" aria-hidden="true">');
		var starCount = data[i].stargazers_count;
		var stars = $('<p class="repo-misc-stars">');
		stars.html(starCount);

		if(starCount > 0)
		{
			misc.append(starIcon);
			misc.append(stars);
		}

		var forkIcon = $('<i class="fa fa-code-fork repo-fork-icon" aria-hidden="true">');
		var forkCount = data[i].forks;
		var forks = $('<p class="repo-misc-forks">');
		forks.html(forkCount);

		if(forkCount > 0)
		{
			misc.append(forkIcon);
			misc.append(forks);
		}

		repo.append(misc);
		$('.projects').append(repo);
	}
});