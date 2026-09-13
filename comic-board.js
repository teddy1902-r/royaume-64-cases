(() => {
  const sourceBoard = document.getElementById('chessboard');
  const comicBoard = document.getElementById('comicChessboard');
  const title = document.getElementById('chapterTitle');
  const gameCard = document.getElementById('gameCard');
  const badge = document.getElementById('comicGameBadge');

  if (!sourceBoard || !comicBoard || !title || !gameCard) return;

  function isChapterOneActive() {
    return !gameCard.classList.contains('hidden') &&
      title.textContent.trim() === "L'échiquier abandonné";
  }

  function syncBoard() {
    const active = isChapterOneActive();
    comicBoard.classList.toggle('active', active);
    if (badge) badge.classList.toggle('active', active);

    if (!active) {
      comicBoard.innerHTML = '';
      return;
    }

    comicBoard.innerHTML = sourceBoard.innerHTML;

    comicBoard.querySelectorAll('.square').forEach((square) => {
      const coord = square.dataset.square;
      square.setAttribute('tabindex', '-1');
      square.addEventListener('click', () => {
        const original = sourceBoard.querySelector(`[data-square="${coord}"]`);
        if (original) original.click();
      });
    });
  }

  new MutationObserver(syncBoard).observe(sourceBoard, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  new MutationObserver(syncBoard).observe(title, {
    childList: true,
    characterData: true,
    subtree: true
  });

  new MutationObserver(syncBoard).observe(gameCard, {
    attributes: true,
    attributeFilter: ['class']
  });

  window.addEventListener('resize', syncBoard);
  syncBoard();
})();