export class EventBus {
  private _listeners: Record<string, Array<(...a: any[]) => void>>

  constructor() {
    this._listeners = {}
  }

  on(event: string, callback: (...a: any[]) => void) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }

    this._listeners[event].push(callback)
  }

  off(event: string, callback: () => void) {
    if (!this._listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this._listeners[event] = this._listeners[event].filter(
      (listener) => listener !== callback
    )
  }

  emit(event: string, ...args: any) {
    if (!this._listeners[event]) {
      // throw new Error(`Нет события: ${event}`)
      console.error(`Нет события: ${event}`)
      return
    }

    this._listeners[event].forEach(function (listener) {
      listener(...args)
    })
  }
}
