const Router = require('./router')
const r = new Router()

const ContentTypes = {
  plain: 'text/plain',
  json: 'application/json',
  html: 'text/html'
}

const name = 'Faizal Somani'

const title = 'Welcome to Faizal\'s Website'

const avatar = 'https://scontent.fyto1-2.fna.fbcdn.net/v/t1.0-9/82861390_2677212949015260_1370341961835216896_o.jpg?_nc_cat=107&ccb=2&_nc_sid=09cbfe&_nc_ohc=bR_JosrSm9wAX_fs0pT&_nc_ht=scontent.fyto1-2.fna&oh=0ea93ef914a145985866aadff0745bbe&oe=5FB990DD'

const links = [
  {
    name: 'My Top 2019 Songs',
    url: 'https://open.spotify.com/playlist/37i9dQZF1EtntwqTxBC0Tq'
  },
  {
    name: 'My Research Paper',
    url: 'https://drive.google.com/file/d/1zl7UVwb0ue0mHaiEM98FNsQf1qJNFD-a/view?usp=sharing'
  },
  {
    name: 'My Cat',
    url: 'https://www.instagram.com/princessfifiherhighness/'
  }
]

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/faizalsomani/',
    img: 'https://simpleicons.org/icons/linkedin.svg',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/faizalsomani',
    img: 'https://simpleicons.org/icons/github.svg',
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/user/faizal9somani',
    img: 'https://simpleicons.org/icons/spotify.svg',
  },
]

class ListTransformer {
  constructor(linkArray) {
    this.links = linkArray
  }

  async element(element) {
    this.links.map(link => {
      if ('img' in link) {
        element.append(
          `<a target="_blank" href=${link.url}><img src=${link.img} alt=${link.name}></a>`,
          {
            html: true,
          }
        )
      } else {
        element.append(
          `<a target="_blank" href=${link.url}>${link.name}</a>`,
          {
            html: true,
          }
        )
      }
    })
  }
}

class SetTransformer {
  constructor(attr, value) {
    this.attr = attr
    this.value = value
  }
  async element(element) {
    element.setAttribute(this.attr, this.value)
  }
}

class RemoveTransformer {
  constructor(attr) {
    this.attr = attr
  }

  async element(element) {
    element.removeAttribute(this.attr)
  }
}

class SetContentTransformer {
  constructor(content) {
      this.content = content
  }
  async element(element) {
      element.setInnerContent(this.content)
  }
  }

function getHeaders(type) {
  return { headers: { 'content-type': type } }
}

const rewriter = new HTMLRewriter()
  .on('h1#name', new SetContentTransformer(name))
  .on('title', new SetContentTransformer(title))
  .on('img#avatar', new SetTransformer('src', avatar))
  .on('body', new SetTransformer('class', 'bg-purple-300'))
  .on('div#links', new ListTransformer(links))
  .on('div#social', new RemoveTransformer('style'))
  .on('div#social', new ListTransformer(socialLinks))
  .on('div#profile', new RemoveTransformer('style'))

  /**
   * Route and respond /links
   * @param {Request} request
   */

async function genericRequestHabdler(request) {
  const head = getHeaders(ContentTypes.html)
  const body = await fetch(
    'https://static-links-page.signalnerve.workers.dev',
    head
  )
  return rewriter.transform(body)
}

/**
 * Route and respond /links
 * @param {Request} request
 */
async function linksRequestHandler(request) {
  const head = getHeaders(ContentTypes.json)
  const body = JSON.stringify(links)

  return new Response(body, head)
}

/**
 * Route and respond accordingly
 * @param {Request} request
 */
async function handleRequest(request) {

  r.get('/links', request => linksRequestHandler(request))
  r.get('/*', request => genericRequestHabdler(request))
  const resp = await r.route(request)

  return resp
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})