(() => {
  const title = document.getElementById('chapterTitle');
  const image = document.getElementById('storyImage');
  const frame = image ? image.closest('.comic-frame') : null;
  const board = document.getElementById('chessboard');
  const gameCard = document.getElementById('gameCard');
  const miniLabel = document.getElementById('miniGameLabel');
  const chapterActions = document.getElementById('chapterActions');
  const captionCover = document.createElement('div');
  captionCover.className = 'caption-cover hidden';
  frame.appendChild(captionCover);
  if (!title || !image || !frame || !board) return;

  const chapterCaption = document.createElement('div');
  chapterCaption.className = 'chapter-caption hidden';
  chapterCaption.textContent = 'La pièce oubliée';
  frame.appendChild(chapterCaption);

  // Editable digits over the two printed move counts in chapter 9.
  const moveCountLabels = [
    { left: 932, top: 255, width: 11, height: 18 },
    { left: 600, top: 511, width: 12, height: 20 }
  ].map(box => {
    const element = document.createElement('span');
    element.textContent = '3';
    element.className = 'hidden';
    element.setAttribute('aria-label', '3 coups');
    Object.assign(element.style, {
      position: 'absolute', zIndex: '7', background: '#fff',
      color: '#111', fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: '400', lineHeight: '1', display: 'flex',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
    });
    frame.appendChild(element);
    return { box, element };
  });

  const chapters = [
    "L'échiquier abandonné","Le Cavalier prisonnier","Le Fou du pont","La pièce oubliée","Le piège de la Reine","Le piège du Roi Noir","La salle des cases","L'armée noire","Le dernier duel"
  ];

  const imageVersion = '20260913-8';
  const chapterImages = [
    'images/chapitre1_echequier_vide_HD.png','images/chapitre2_echequier vide_HD.png','images/chapitre3_echequier vide_HD.png','images/chapitre4_echequier vide_HD.png','images/chapitre5_exhequier vide_HD.png','images/chapitre6_echequier vide_HD.png','images/chapitre7_echequier vide_HD.png','images/chapitre8_echeque vide_HD.png','images/chapitre9_echequier vide_HD.png'
  ];

  // Inner board edges measured separately on each 1536 × 1024 illustration.
  const boardPixels = [
    [1068, 274, 1488, 712], // Chapter 1
    [1068, 275, 1488, 713], // Chapter 2
    [1067, 274, 1488, 709], // Chapter 3
    [1068, 275, 1488, 713], // Chapter 4: same illustrated panel as chapter 2
    [1068, 273, 1488, 708], // Chapter 5
    [1067, 271, 1489, 709], // Chapter 6
    [1067, 274, 1489, 709], // Chapter 7
    [1068, 272, 1488, 710], // Chapter 8
    [1068, 275, 1488, 713]  // Chapter 9: same illustrated panel as chapter 2
  ];
  const boardBoxes = boardPixels.map(([left, top, right, bottom]) => ({
    left: left / 1536 * 100, top: top / 1024 * 100,
    width: (right - left) / 1536 * 100, height: (bottom - top) / 1024 * 100
  }));
  const labelBoxes = boardBoxes.map(box => ({
    left: box.left, top: box.top - 6.1, width: box.width
  }));

  const miniTexts = [
    'Mini-jeu 1 — Mat en 1 coup\nTrait aux Blancs',
    'Mini-jeu 2 — Sacrifice\nTrait aux Blancs',
    'Mini-jeu 3 — Résolvez le problème\nTrait aux Blancs',
    'Mini-jeu 4 — Le fou décisif\nTrait aux Blancs',
    'Mini-jeu 5 — La menace invisible\nTrait aux Blancs',
    'Mini-jeu 6 — Mat en deux coups\nTrait aux Blancs',
    'Mini-jeu 7 — Mat en 2 coups\nTrait aux Blancs',
    'Mini-jeu 8 — Mat en 3 coups\nTrait aux Blancs',
    'Mini-jeu 9 — Le sacrifice royal\nTrait aux Blancs'
  ];

  let currentChapterIndex = 0;

  function positionOverlays() {
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
    const frameRect = frame.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    if (imageRect.width < 10 || imageRect.height < 10 || frameRect.width < 10 || frameRect.height < 10) return;

    const box = boardBoxes[currentChapterIndex] || boardBoxes[0];
    const labelBox = labelBoxes[currentChapterIndex] || labelBoxes[0];
    // object-fit: contain can leave margins INSIDE the image element.
    // Anchor every overlay to the visible bitmap, not the element's box.
    const scale = Math.min(imageRect.width / image.naturalWidth, imageRect.height / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;
    const imageLeft = imageRect.left - frameRect.left + (imageRect.width - imageWidth) / 2;
    const imageTop = imageRect.top - frameRect.top + (imageRect.height - imageHeight) / 2;

    moveCountLabels.forEach(({ box, element }) => {
      element.classList.toggle('hidden', currentChapterIndex !== 8);
      element.style.left = `${imageLeft + imageWidth * box.left / 1536}px`;
      element.style.top = `${imageTop + imageHeight * box.top / 1024}px`;
      element.style.width = `${imageWidth * box.width / 1536}px`;
      element.style.height = `${imageHeight * box.height / 1024}px`;
      element.style.fontSize = `${imageHeight * 16 / 1024}px`;
    });

    chapterCaption.classList.toggle('hidden', currentChapterIndex !== 3);
    const usesSharedParchment = currentChapterIndex === 3 || currentChapterIndex === 8;
    captionCover.classList.toggle('hidden', !usesSharedParchment);
    if (usesSharedParchment) {
      // Reuse chapter 2's actual parchment panel as a CSS image crop.
      captionCover.style.left = `${imageLeft + imageWidth * 1023 / 1536}px`;
      captionCover.style.top = `${imageTop + imageHeight * 167 / 1024}px`;
      captionCover.style.width = `${imageWidth * 513 / 1536}px`;
      captionCover.style.height = `${imageHeight * 660 / 1024}px`;
      captionCover.style.backgroundImage = `url("${chapterImages[1]}?v=${imageVersion}")`;
      captionCover.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
      captionCover.style.backgroundPosition = `-${imageWidth * 1023 / 1536}px -${imageHeight * 167 / 1024}px`;
    }
    if (currentChapterIndex === 3) {
      chapterCaption.style.left = `${imageLeft + imageWidth * 1038 / 1536}px`;
      chapterCaption.style.top = `${imageTop + imageHeight * 73 / 1024}px`;
      chapterCaption.style.width = `${imageWidth * 280 / 1536}px`;
      chapterCaption.style.height = `${imageHeight * 41 / 1024}px`;
      chapterCaption.style.fontSize = `${imageWidth * 35 / 1536}px`;
    }

    board.style.left = `${imageLeft + imageWidth * box.left / 100}px`;
    board.style.top = `${imageTop + imageHeight * box.top / 100}px`;
    board.style.width = `${imageWidth * box.width / 100}px`;
    board.style.height = `${imageHeight * box.height / 100}px`;
    board.style.setProperty('--piece-size', `${Math.min(imageWidth * box.width, imageHeight * box.height) / 100 / 8 * 0.78}px`);
    board.style.visibility = 'visible';

    if (chapterActions) {
      chapterActions.style.left = board.style.left;
      chapterActions.style.top = `${imageTop + imageHeight * (box.top + box.height + 3) / 100}px`;
      chapterActions.style.width = board.style.width;
      chapterActions.style.height = `${imageHeight * 0.047}px`;
      chapterActions.style.fontSize = `${imageWidth * 0.013}px`;
    }

    if (miniLabel) {
      const text = miniTexts[currentChapterIndex] || '';
      miniLabel.replaceChildren();
      if (text) {
        const [heading, subtitle] = text.split('\n');
        const headingEl = document.createElement('strong');
        headingEl.textContent = heading;
        const subtitleEl = document.createElement('small');
        subtitleEl.textContent = subtitle || '';
        miniLabel.append(headingEl, subtitleEl);
      }
      miniLabel.style.display = text ? 'block' : 'none';
      miniLabel.style.left = `${imageLeft + imageWidth * labelBox.left / 100}px`;
      miniLabel.style.top = `${imageTop + imageHeight * labelBox.top / 100}px`;
      miniLabel.style.width = `${imageWidth * labelBox.width / 100}px`;
      miniLabel.style.fontSize = `${imageWidth * (currentChapterIndex === 3 ? 0.0105 : currentChapterIndex === 2 ? 0.0116 : 0.014)}px`;
    }
  }

  function positionSoon() {
    requestAnimationFrame(() => {
      positionOverlays();
      setTimeout(positionOverlays, 80);
      setTimeout(positionOverlays, 250);
    });
  }

  function refreshScene() {
    currentChapterIndex = Math.max(0, chapters.indexOf(title.textContent.trim()));
    const chapterNumber = currentChapterIndex + 1;
    frame.dataset.chapter = String(chapterNumber);
    const nextSrc = `${chapterImages[currentChapterIndex]}?v=${imageVersion}`;
    if (image.getAttribute('src') !== nextSrc) {
      board.style.visibility = 'hidden';
      image.src = nextSrc;
    }
    image.alt = `Chapitre ${chapterNumber} - ${chapters[currentChapterIndex]}`;
    positionSoon();
  }

  image.addEventListener('load', positionSoon);
  window.addEventListener('resize', positionSoon);
  window.addEventListener('orientationchange', () => setTimeout(positionSoon, 150));
  if (gameCard) new MutationObserver(positionSoon).observe(gameCard,{attributes:true,attributeFilter:['class']});
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(positionSoon);
    observer.observe(frame);
    observer.observe(image);
  }
  new MutationObserver(refreshScene).observe(title,{childList:true,characterData:true,subtree:true});
  refreshScene();
})();