'use strict'

import EventEmitter from 'events'

export default class Hooks extends EventEmitter {

  saving(listener) {
    this.on('saving', listener)
  }

  saved(listener) {
    this.on('saved', listener)
  }

  updating(listener) {
    this.on('updating', listener)
  }

  updated(listener) {
    this.on('updated', listener)
  }

  creating(listener) {
    this.on('creating', listener)
  }

  created(listener) {
    this.on('created', listener)
  }

  deleting(listener) {
    this.on('deleting', listener)
  }

  deleted(listener) {
    this.on('deleted', listener)
  }

}
