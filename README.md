# github-url-shortener

Github Pages powered url shortener
Shorten your URLs publishing redirect links on a Github Page

## Setup

- Clone this repo
- Update your `CNAME` file to your domain
- Link `shorturl` to a directory part of `PATH` 
- eg. `ln -s "$(pwd)/shorturl" /usr/bin/shorturl`

## How to use

```bash
shorturl link [id]
```

- Create a page which redirect to `link` and push it to your repo
- If an `id` is provided (and it hasn't been used yet) the page will use that
- Check your link at `http://YOURDOMAIN/ID`
