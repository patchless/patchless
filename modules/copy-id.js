var isElectron = require('is-electron')

exports.gives = {
  message: { action: true },
  avatar: { action: true }
}

exports.create = function (api) {
  return {
    message: { action: function (data) {
      if(isElectron()) {
        var a = document.createElement('a')
        a.href = '#'
        a.textContent = 'copy id'
        a.title = 'click to copy this message id to the clipboard'
        a.onclick = function () {
          require('electron').clipboard.writeText(data.key)
        }
        return a
      }
    }
  },
  avatar: { action: function (id) {
      if(isElectron()) {
        var a = document.createElement('a')
        a.href = '#'
        a.textContent = 'copy id'
        a.title = 'click to copy this message id to the clipboard'
        a.onclick = function () {
          require('electron').clipboard.writeText(id)
        }
        return a
      }
    }
  },


  }
}







