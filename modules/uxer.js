var h = require('hyperscript')
var pull = require('pull-stream')
var ref = require('ssb-ref')
var markdown = require('ssb-markdown')
var Scroller = require('pull-scroll')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

exports.needs = {
  sbot: { createUserStream: 'first' },
  avatar: {image: 'first', name: 'first'}
}

exports.gives = {
  app: {view: true}
}

exports.create = function (api) {
  function render (data) {
    return h('div.message', [
      h('div.Avatar',
        h('a', {href: data.value.author},
          api.avatar.image(data.value.author),
          api.avatar.name(data.value.author)
        ),
      ),
      h('a', {href: data.key}, new Date(data.value.timestamp)),
      h('div.markdown',
        {innerHTML: markdown.block(data.value.content.text, {toUrl: function (url, image) {
          if(!image) return url
          if(url[0] !== '&') return url
          return 'http://localhost:8989/blobs/get/'+url
        }})}
      )]
    )
  }

  return {
    app: {
      view: function (src) {
        if(!ref.isFeed(src)) return

        var content = h('div.content')
        var el = h('div')

        function createStream (opts) {
          return pull(
            More(api.sbot.createUserStream, opts, ['value', 'sequence']),
            pull.filter(function (data) {
              return 'string' === typeof data.value.content.text
            }),
            pull.map(render)
          )
        }

        pull(
          createStream({old: false, limit: 10, id: src}),
          HyperMoreStream.top(content)
        )

        pull(
          createStream({reverse: true, live: false, limit: 10,
            id: src
          }),
          HyperMoreStream.bottom(content)
        )


        return content
      }
    }
  }
}

