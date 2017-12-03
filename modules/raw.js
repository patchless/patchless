var h = require('hyperscript')
var pull = require('pull-stream')
var ref = require('ssb-ref')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

exports.needs = {
  sbot: { createLogStream: 'first' },
}

exports.gives = {
  app: { menu: true, view: true }
}

function rawJSON (obj) {
  return h('pre.raw__json',
    JSON.stringify(obj, null, 2)
      .split(/([%@&][a-zA-Z0-9\/\+]{43}=*\.[\w]+)/)
      .map(function (e) {
        if(ref.isMsg(e) || ref.isFeed(e) || ref.isBlob(e))
          return h('a', {href: e}, e)
        return e
      })
  )
}

exports.create = function (api) {
  return {
    app: {
      view: function (src) {
        if(src !== 'raw') return

        var content = h('div.content')

        function createStream (opts) {
          return pull(
            More(api.sbot.createLogStream, opts),
            pull.filter(function (data) {
              return 'string' === typeof data.value.content.text
            }),
            pull.map(rawJSON)
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
        return 'raw'
      }
    }
  }
}







