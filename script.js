const leaderboard_updated = localStorage.getItem('leaderboard_updated');
const current_time = new Date().getTime();
if (leaderboard_updated === null || leaderboard_updated < (current_time + 3600)) {
  fetch('https://athletable.com/sports/26db38d401.json?api_key=5e20ddf7a96bea6a4d92d23487e6fc5412e9d414')
    .then(response => response.json())
    .then(results => {
      localStorage.setItem('leaderboard_updated', current_time);
      localStorage.setItem('leaderboard', JSON.stringify(results));
      build_leaderboard(results);
      document.querySelector('.loading').style.display = 'none';
    })
    .catch(e => console.log("Something went wrong", e)
  );
} else {
  var leaderboard = localStorage.getItem('leaderboard');
  build_leaderboard(JSON.parse(leaderboard));
  document.querySelector('.loading').style.display = 'none';
}

function build_leaderboard(results) {
  const list = document.querySelector('ol');

  results.leaderboard.slice(0, 10).forEach(function (item) {
    const el = document.createElement('li');
    const playerName = item.player.name.replace(/"([^"]+)"/g, '<span class="nickname">$1</span>');

    if (item.photo_url && item.photo_url.indexOf('media') >= 0) {
      item.photo_url = 'http://athletable.com' + item.photo_url;
    }

    const playerEl = document.createElement('div');
    playerEl.classList.add('player-name');

    const playerPhotoEl = document.createElement('img');
    playerPhotoEl.src = item.photo_url;

    const rankEl = document.createElement('span');
    rankEl.classList.add('rank-number');
    rankEl.textContent = item.rank;

    playerEl.appendChild(playerPhotoEl);
    playerEl.appendChild(rankEl);
    playerEl.textContent = playerName;

    if (item.rank_changed_at === item.updated_at) {
      const rankChangeEl = document.createElement('div');
      const rankChangeArrow = document.createElement('span');

      rankChangeEl.classList.add('rank-change');

      if (item.rank < item.rank_before) {
        rankChangeArrow.innerHTML = '&uarr;';
        rankChangeEl.classList.add('upward');
      }
      else {
        rankChangeArrow.innerHTML = '&darr;';
        rankChangeEl.classList.add('downward');
      }

      rankChangeEl.appendChild(rankChangeArrow);
      rankChangeEl.textContent = Math.abs(item.rank - item.rank_before);

      playerEl.appendChild(rankChangeEl);
    }

    el.appendChild(playerEl);
  });
}
