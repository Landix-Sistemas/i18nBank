/* jslint node: true */
'use strict'
/*
  if you aren't using a build step
  and you want to use this in the
  browser, remove the "require"
  and load it in using:
  <script src="path/to/gun.js">
  <script src="index.js">
*/
var Gun
if (typeof window !== 'undefined') {
  Gun = window.Gun
}
else {
  Gun = require('gun/gun')
}

// end remove

Gun.chain.valMapEnd = function (cb, end) {
  var n = function () {},
    count = 0,
    props = [],
    gun = this
  cb = cb || n
  end = end || n

  gun.val(function (list) {
    var args = Array.prototype.slice.call(arguments)
    Gun.node.is(list, function (n, prop) {
      count += 1
      props.push(prop)
    })
    if (props.length === 0) {
      end.apply(gun, args)
      return
    }
    props.forEach(function (prop) {
      gun.path(prop).val(function (val, key) {
        count -= 1
        cb.apply(this, arguments)
        if (!count) {
          end.apply(this, args)
        }
      })
    })
  })
  return gun
}
