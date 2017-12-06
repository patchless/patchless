var pull = require('pull-stream')
var ssbKeys = require('ssb-keys')
//var ref = require('ssb-ref')
var Reconnect = require('pull-reconnect')
var path = require('path')
var config = require('ssb-config/inject')(process.env.ssb_appname)

var ssbKeys = require('ssb-keys')
var config = require('ssb-config')
var path = require('path')
var keys = config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

//
//function Hash (onHash) {
//  var buffers = []
//  return pull.through(function (data) {
//    buffers.push('string' === typeof data
//      ? new Buffer(data, 'utf8')
//      : data
//    )
//  }, function (err) {
//    if(err && !onHash) throw err
//    var b = buffers.length > 1 ? Buffer.concat(buffers) : buffers[0]
//    var h = '&'+ssbKeys.hash(b)
//    onHash && onHash(err, h)
//  })
//}
//

//uncomment this to use from browser...
//also depends on having ssb-ws installed.
//var createClient = require('ssb-lite')
var createClient = require('ssb-client')

var createConfig = require('ssb-config/inject')

var cache = CACHE = {}

module.exports = {
//  needs: {
//    connection_status: 'map'
//  },
  gives: {
    sbot: {
      get: true,
      createLogStream: true,
      createUserStream: true,
      links: true,
      progress: true,
      status: true,

      friends: {
        get: true
      },

      names: {
        get: true,
        getSignifier: true,
        getSignifies: true
      }
    }
  },

//module.exports = {
  create: function (api) {

    var opts = createConfig()
    var sbot = null
    var connection_status = []

    var rec = {
      sync: function () {},
      async: function () {},
      source: function () {},
    }

    var rec = Reconnect(function (isConn) {
      function notify (value) {
        isConn(value);
        //api.connection_status(value) //.forEach(function (fn) { fn(value) })
      }

      createClient(keys, {
        manifest: require('../manifest.json'),
//        remote: require('../config')().remote,
        caps: config.caps
      }, function (err, _sbot) {
        if(err)
          return notify(err)

        sbot = _sbot
        sbot.on('closed', function () {
          sbot = null
          notify(new Error('closed'))
        })

        notify()
      })
    })

    return {
      sbot: {
        createLogStream: rec.source(function (opts) {
          return pull(
            sbot.createLogStream(opts),
            pull.through(function (e) {
              CACHE[e.key] = CACHE[e.key] || e.value
            })
          )
        }),
        createUserStream: rec.source(function (opts) {
          return pull(
            sbot.createUserStream(opts),
            pull.through(function (e) {
              CACHE[e.key] = CACHE[e.key] || e.value
            })
          )
        }),
        links: rec.source(function (opts) {
          return sbot.links(opts)
        }),
        get: rec.async(function (key, cb) {
          if('function' !== typeof cb)
            throw new Error('cb must be function')
          if(CACHE[key]) cb(null, CACHE[key])
          else sbot.get(key, function (err, value) {
            if(err) return cb(err)
            cb(null, CACHE[key] = value)
          })
        }),
        progress: rec.async(function (cb) {
          sbot.progress(cb)
        }),
        status: rec.async(function (cb) {
          sbot.status(cb)
        }),
        friends: {
          get: rec.async(function (opts, cb) {
            sbot.friends.get(opts, cb)
          })
        },
        names: {
          get: rec.async(function (opts, cb) {
            sbot.names.get(opts, cb)
          }),
          getSignifier: rec.async(function (opts, cb) {
            sbot.names.getSignifier(opts, cb)
          }),
          getSignifies: rec.async(function (opts, cb) {
            sbot.names.getSignifies(opts, cb)
          })
        }
      }
    }
  }
}

