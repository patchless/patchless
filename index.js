var fs = require('fs')
var path = require('path')

if('undefined' === typeof setImmediate)
  setImmediate = setTimeout

require('depject')([
require('./modules/search'),
//require('patchapp-rollup'),
//NOTE: there is a bug in depject...
//it should be possible to have this last... but it seems to fail unless it's first.
//load a whole "app" at a time this way. it's also possible to customize this app
//by disabling parts of it.. say how the threads are rolled up or not...
require('patchapp-threads'),

//there is a weird bug here, where the level of nesting effects the load order.
require('patchapp-raw'),

{
  //choose which layout you like, these all work

//  nav: require('patchnav-less'),
//  nav: require('patchnav-basic'),
  nav:  require('patchnav-tabs'),
//  nav:  require('patchnav-command'),

//TEMP, MOVE ALL MODULES TO NPM
sbot:  require('./modules/sbot'),

  //load and manage identities
  id:  require('patchidentity'),
//}, {
  //text inputs
compose:  require('patchcompose'),

names:  require('patchavatar-names'),
friends: require('patchapp-friends'),
//avatarViews:  require('patchavatar-names/view'),
  //provides avatars, but doesn't actually do names.
avatarRaw:  require('patchavatar-raw'),

  //confirm after posting a message
confirm:  require('patchconfirm-lightbox'),
suggest: require('patchsuggest'),
},
//this doesn't load if it's after APP but does if it's here
//if it's after app is still works, but only if it's separate
//this seems like a bug in depject!
require('patchcompose-drafts'),
{
  app: {
    gives: {},
    needs: { nav: {screen: 'first' }},
    create: function (api) {
      document.body.appendChild(api.nav.screen())
      var style = document.createElement('style')
      style.textContent = fs.readFileSync(path.join(__dirname, 'style.css'))
      document.body.appendChild(style)
      return function () {}
    }
  }
},
require('patchapp-vote'),
//add drafts (stored in localStorage to all composers)
//add file uploads to composer
require('patchcompose-file'),
//support old style mentions, so that patchwork users get notifications on mentions
require('patchcompose-legacy-mentions'),
require('patchcompose-recipients'),
require('patchcompose-mentioned-recipients'),
require('./modules/copy-id'),

//adds search
require('patchsuggest-fulltext'),

//shows recipients in private messages
require('patchmisc-recipients'),
require('../patchapp-identities')
])

