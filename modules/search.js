'use strict'
var h = require('hyperscript')
var SuggestBox = require('suggest-box')

exports.needs= {
  suggest: { search: 'first' },
  nav: {goto: 'first'}
}

exports.gives = {
  app: { viewMenu: true }
}

exports.create = function (api) {

  //okay this shouldn't be in the patchless repo,
  //should be somewhere else...

  return { app: { viewMenu: function (src) {
    var input = h('input.patchless__modules__search')
    var wrapped = h('span', input)

    SuggestBox(input, function (word, cb) {
      var fn = api.suggest.search(word)
      if(!fn) return cb()
      fn(word, cb)
    })

    input.onkeydown = function (ev) {

      if(ev.keyCode !== 13) return
      if(api.nav.goto(input.value.trim()))
        input.value = ''
    }

    return wrapped
  }}}

}


