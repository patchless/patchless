
require('depject')([
  //choose which layout you like, these all work

//  require('patchnav-less'),
//  require('patchnav-basic'),
  require('patchnav-tabs'),

  //TEMP, MOVE ALL MODULES TO NPM
  require('./modules/sbot'),
  require('./modules/public'),
  require('./modules/private'),
  require('./modules/raw'),

  //renders message threads
  require('patchthreads'),

  //provides avatars, but doesn't actually do names.
  require('patchavatar-raw'),

  //call the layout and add to the DOM.
  {
    gives: {},
    needs: { nav: {screen: 'first' }},
    create: function (api) {
      document.body.appendChild(api.nav.screen())
      var style = document.createElement('style')
      style.textContent = require('fs').readFileSync(
        require('path').join(__dirname, 'style.css')
      )
      document.body.appendChild(style)
      return function () {}
    }
  }
])






