var h = require('hyperscript')
var pull = require('pull-stream')
var ref = require('ssb-ref')
var markdown = require('ssb-markdown')
var Scroller = require('pull-scroll')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

var ssbKeys = require('ssb-keys')
var config = require('ssb-config')
var path = require('path')
var keys = config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

exports.needs = {
  sbot: { createLogStream: 'first' },
  avatar: {image: 'first', name: 'first'}
}

exports.gives = {
  app: {menu: true, view: true}
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
          console.log('TOURL', url)
          return 'http://localhost:8989/blobs/get/'+url
        }})}
      )]
    )
  }

  return {
    app: {
      view: function (src) {
        if(src !== 'private') return

        var content = h('div.content')
        var el = h('div')

        function createStream (opts) {
          return pull(
            More(api.sbot.createLogStream, opts),
            pull.map(function (data) {
              if('string' === typeof data.value.content) {
                var plaintext = ssbKeys.unbox(data.value.content, keys)
                if(!plaintext) return
                data.value.content = plaintext
                return data
              }
            }),
            pull.filter(function (data) {
              return data && 'string' === typeof data.value.content.text
            }),
            pull.map(render)
          )
        }

        pull(
          createStream({old: false, limit: 10}),
          HyperMoreStream.top(content)
        )

        pull(
          createStream({reverse: true, live: false, limit: 10}),
          HyperMoreStream.bottom(content)
        )


        return content
      },
      menu: function () {
        return 'private'
      }
    }
  }
}







