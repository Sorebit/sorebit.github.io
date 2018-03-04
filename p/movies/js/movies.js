$('li').on('click', function() {
	const name = $(this).find('.movie-name')[0];
	const year = $(this).find('.movie-year')[0];
	if(!name || !year)
		return;
	const full = $(name).text() + ' ' + $(year).text();
	
	let filmweb = $('input[type="checkbox"]').prop('checked');
	if(filmweb) {
		const esc = escape($(name).text());
		window.open('https://www.filmweb.pl/search?q=' + esc);
		localStorage['useFilmweb'] = 'yes';
	} else {
		const esc = escape(full);
		window.open('https://www.google.pl/search?q=' + esc);
		localStorage['useFilmweb'] = 'no';
	}
});

$(document).ready(function() {
	if(localStorage['useFilmweb'] !== 'yes' && localStorage['useFilmweb'] !== 'no') {
		localStorage['useFilmweb'] = 'yes';
	}
	const f = (localStorage['useFilmweb'] === 'yes');
	$('input').prop('checked', f);
});