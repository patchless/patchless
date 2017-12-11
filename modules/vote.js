var h = require('hyperscript')
var pull = require('pull-stream')

exports.gives = {
  message: { action: true, render: true }
}

exports.needs = {
  sbot: { links: 'first', names: { getSignifier: 'first' } },
  confirm: { show: 'first' }
}

exports.create = function (api) {
  return { message: {
    action: function (msg, context) {
      var expression = 'yup'
      var y =  h('a', expression, { href:"#", onclick: function (ev) {
        api.confirm.show({
          type: 'vote', vote: {
            link: msg.key, value: 1, expression: 'yup'
          }
        }, null, function () {})
      }})
      var c = 0
      pull(
        api.sbot.links({dest: msg.key, rel: 'vote'}),
        pull.drain(function (e) {
          api.sbot.names.getSignifier(e.source, function (err, name) {
            if(name) y.title += name + '\n'
          })
          c ++
          y.textContent = c+' '+expression
        })
      )
      return y
    },
    render: function (msg) {
      if(msg.content.type == 'vote') {
        var id = msg.content.vote.link
        return h('p', 'YUP!', h('a', id, {href: id}))
      }
    }
  }}
}






