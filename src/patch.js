import { StateEnums } from './utils'
import Element from './element'

let index = 0

export default function patch (node, patches) {
  const changes = patches[index]
  if (changes) changeDom(node, changes)

  const childNodes = node.childNodes
  let last
  if (!childNodes) {
    index += 1
  } else {
    childNodes.forEach(item => {
      index = last && last.children ? index + last.children.length + 1 : index + 1
      patch(item, patches)
      last = item
    })
  }
  console.log(index)
}

function changeDom (node, changes) {
  changes.forEach(change => {
    const { type, props, index, node: changeNode, from, to } = change
    switch (type) {
      case StateEnums.ChangeProps:
        props.forEach(item => {
          const { prop, value } = item
          value ? node.setAttribute(prop, value) : node.removeAttribute(prop)
        })
        break
      case StateEnums.Remove:
        node.childNodes[index].remove()
        break
      case StateEnums.Insert:
        const dom = changeNode instanceof Element ? changeNode.create() : document.createTextNode(changeNode)
        node.insertBefore(dom, node.childNodes[index])
        break
      case StateEnums.Replace:
        node.parentNode.replaceChild(changeNode.create(), node)
        break
      case StateEnums.Move:
        const fromNode = node.childNodes[from]
        const toNode = node.childNodes[to]
        const cloneFromNode = fromNode.cloneNode(true)
        const cloneToNode = toNode.cloneNode(true)
        node.replaceChild(cloneFromNode, toNode)
        node.replaceChild(cloneToNode, fromNode)
        break
      default:
        break
    }
  })
}
