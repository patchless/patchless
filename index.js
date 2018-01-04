var fs = require('fs')
var path = require('path')

if('undefined' === typeof setImmediate)
  setImmediate = setTimeout

require('depject')([
//require('patchapp-rollup'),
//NOTE: there is a bug in depject...
//it should be possible to have this last... but it seems to fail unless it's first.
//load a whole "app" at a time this way. it's also possible to customize this app
//by disabling parts of it.. say how the threads are rolled up or not...
require('patchapp-threads'),

//there is a weird bug here, where the level of nesting effects the load order.
{rawMessages: require('./modules/raw')},

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
avatarViews:  require('patchavatar-names/view'),
  //provides avatars, but doesn't actually do names.
avatarRaw:  require('patchavatar-raw'),

  //confirm after posting a message
confirm:  require('patchconfirm-lightbox'),
suggest: require('patchsuggest'),
},
{
app:  {
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
require('patchcompose-drafts'),
//add file uploads to composer
require('patchcompose-file'),
//support old style mentions, so that patchwork users get notifications on mentions
require('patchcompose-legacy-mentions'),
require('patchcompose-recipients'),
require('./modules/copy-id'),
require('patchsuggest-fulltext')
])



