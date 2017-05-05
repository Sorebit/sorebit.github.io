$('#navbar-loader').load('https://sorebit.github.io/views/navbar.html', function(response, status, xhr) {
  if(status == 'error') {
    var msg = 'Sorry but there was an error: ';
    console.error(msg + xhr.status + ' ' + xhr.statusText);
  }
});