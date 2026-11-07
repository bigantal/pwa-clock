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

Every push to `main` runs the tests and publishes `static/` to GitHub Pages, using `.github/workflows/pages.yml`. In the repository's Settings → Pages, Source must be set to "GitHub Actions".

## Service worker

`static/sw.js` answers from its cache and refreshes that cache in the background, so a deployed change appears on the second launch after it goes live. When you add a file the app needs offline, add it to the `PRECACHE` list too. `npm test` fails if a file referenced by the page or manifest is missing from the list.

## License

[Apache 2.0](LICENSE)
