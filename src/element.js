export default class Element {
  /**
   * JS 对象模拟 DOM 对象的简单实现
   *
   * @param {String} tag 'div'
   * @param {Object} props { class: 'item' }
   * @param {Array} children [ Element1, 'text']
   * @param {String} key option
   */
  constructor (tag, props, children, key) {
    this.tag = tag && typeof tag === 'string' ? tag : 'div'
    this.props = props && props instanceof Object ? props : {}
    this.children = children && children instanceof Array ? children : []
    this.key = key && typeof key === 'string' ? key : null
  }

  // 渲染
  render () {
    const el = this.create()
    document.body.appendChild(el)
    return el
  }

  create () {
    return this._createElement(this.tag, this.props, this.children, this.key)
  }

  // 创建节点
  _createElement (tag, props, children, key) {
    // 根据 tag 创建节点
    const el = document.createElement(tag)

    // 根据 props 设置节点属性
    Object.keys(props).forEach(key => {
      el.setAttribute(key, props[key])
    })
    key && el.setAttribute('key', key)

    // 根据 children 递归添加子节点
    children.forEach(element => {
      const _el = element instanceof Element
        ? this._createElement(element.tag, element.props, element.children)
        : document.createTextNode(element)
      el.appendChild(_el)
    })

    return el
  }
}
