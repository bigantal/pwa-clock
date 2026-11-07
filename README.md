# PWA clock

A minimal full-screen clock you can install as an app. It shows the local time in 24-hour format, works offline and keeps the screen on while it is open, where the browser supports that.

Live at <https://bigantal.github.io/pwa-clock/>.

## Run it locally

The app is plain static files in `static/`, with no build step or dependencies. Node.js 20 or newer is only used for these two commands:

```sh
npm start     # serves static/ locally and prints the address
npm test
```

Service workers and the screen wake lock only work on `localhost` or over HTTPS.

## Deployment

The app is hosted on GitHub Pages at <https://bigantal.github.io/pwa-clock/>. Every push to `main` runs the tests and, if they pass, publishes only the `static/` folder, using `.github/workflows/pages.yml`. To redeploy without a code change, use **Run workflow** on that workflow in the Actions tab.

Publishing depends on two things:

- **Pages source:** in Settings → Pages, Source must be **GitHub Actions**. With **Deploy from a branch**, GitHub publishes the whole repository through Jekyll, so the site shows this README instead of the clock.
- **One workflow:** `pages.yml` must be the only workflow that deploys to Pages. If there are two, whichever finishes last decides what is live. GitHub's suggested `static.yml` publishes the whole repository, which leaves a 404 at the site address because `index.html` is in `static/`.

The site is served from `/pwa-clock/`, not the domain root, so paths in the app must be relative. `npm test` checks this for the page and manifest.

## Service worker

`static/sw.js` answers from its cache and refreshes that cache in the background, so a deployed change appears on the second launch after it goes live. When you add a file the app needs offline, add it to the `PRECACHE` list too. `npm test` fails if a file referenced by the page or manifest is missing from the list.

## License

[Apache 2.0](LICENSE)
