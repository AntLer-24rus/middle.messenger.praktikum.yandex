/* eslint @typescript-eslint/no-explicit-any: ["warn", { "ignoreRestArgs": true }] */

export type Callback = (...args: any[]) => void

export interface EventBusInterface {
  on(eventName: string, callback: Callback): void
  off(eventName: string, callback: Callback): void
  emit(eventName: string, ...args: any[]): boolean
}

export class EventBus implements EventBusInterface {
  private _listeners: Record<string, Callback[]>

  constructor() {
    this._listeners = {}
  }

  on(event: string, callback: Callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }

    this._listeners[event].push(callback)
  }

  off(event: string, callback: Callback) {
    if (!this._listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this._listeners[event] = this._listeners[event].filter(
      (listener) => listener !== callback
    )
    if (this._listeners[event].length === 0) {
      delete this._listeners[event]
    }
  }

  emit(event: string, ...args: any[]): boolean {
    if (!this._listeners[event]) {
      if (process.env.NODE_ENV) {
        console.error(`Нет события: ${event}`, this._listeners)
      }
      return false
    }

    let call = 0
    this._listeners[event].forEach((listener) => {
      listener(...args)
      call += 1
    })
    if (call >= 1) {
      return true
    }
    return false
  }
}
