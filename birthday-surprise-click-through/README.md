# Birthday Surprise Website

A responsive static birthday website made with HTML, CSS and JavaScript. It can be hosted on GitHub Pages.

## Files
- `index.html` — page sections and text
- `style.css` — romantic dark pink theme and responsive layout
- `script.js` — memory quiz, love notes, envelope, music control and animations
- `assets/` — add your photos and song here

## Add your photos
Copy your own photos into `assets/` and rename them exactly:
- `his-photo.jpg` — first-screen portrait
- `memory-1.jpg` through `memory-4.jpg` — quiz memory photos
- `timeline-1.jpg` through `timeline-3.jpg` — timeline photos
- `final-surprise.jpg` — final reveal photo

If your photo is PNG, either convert it to JPG or update the corresponding filename in `index.html` / `script.js`.

## Add a song
Use an audio file you have permission to use. Name it `our-song.mp3` and put it inside `assets/`.
The song starts when the visitor clicks “Play our song”, because browsers generally block autoplay with sound.

For copyrighted commercial songs, don't upload a copy to the repository unless you have the rights. You can instead use a permitted audio file or embed an official source with its terms in mind.

## Personalise
- Change the heading `My Favourite Person` in `index.html`.
- Edit the letter in the `letter-paper` section of `index.html`.
- Edit the questions, answer choices, dates, captions and correct answer indexes in the `memories` array in `script.js`.
  - `answer: 0` means the first option is correct, `answer: 1` the second, and so on.
- Edit the love notes in the `reasons` array in `script.js`.
- Replace generic timeline text in `index.html`.

## Test locally
Open `index.html` in Chrome. You can also use VS Code's Live Server extension if installed.

## Publish with GitHub Pages
1. Create a new GitHub repository, e.g. `birthday-surprise`.
2. Upload all files and the `assets` folder (not only the HTML file).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main`, folder `/ (root)`, then Save.
6. Wait for the published URL shown in Settings → Pages. It usually looks like `https://YOUR-USERNAME.github.io/birthday-surprise/`.

Important: GitHub Pages is public hosting. Anyone who has the link may be able to view the website and its included photos. Do not put private information in the site. A password prompt built only with JavaScript does not make files private.


## Click-through surprise flow
Only one main chapter is shown at a time. Use the buttons at the bottom of each chapter to continue or go back; the letter itself appears only after tapping **Open my heart**. Replace the placeholder audio files in `assets/` with audio you have permission to use, keeping the filenames expected by `script.js`.
