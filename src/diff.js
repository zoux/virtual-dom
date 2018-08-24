import { StateEnums, move } from './utils'
import Element from './element'

export default function diff (oldDomTree, newDomTree) {
  // 记录差异
  const patches = []
  // 一开始的索引为 0
  diffHandler(oldDomTree, newDomTree, 0, patches)
  return patches
}

/**
 * 树的递归
 *
 * 需要判断三种情况
 * 1. 没有新的节点，那么什么都不用做
 * 2. 新的节点的 tagName 和 key（可能都没有）和旧的相同，开始遍历子树
 * 3. 新的节点的 tagName 和 key 和旧的不同，就替换节点
 */
function diffHandler (oldNode, newNode, index, patches) {
  const currentPatches = []

  if (!newNode) {
    void 0
  } else if (oldNode.tag === newNode.tag && oldNode.key === newNode.key) {
    // 判断属性是否变更
    const props = diffProps(oldNode.props, newNode.props)
    props.length && currentPatches.push({ type: StateEnums.ChangeProps, props })
    // 遍历子树
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    // 节点不同，需要替换
    currentPatches.push({ type: StateEnums.Replace, node: newNode })
  }

  if (currentPatches.length) {
    patches[index] = patches[index] ? patches[index].concat(currentPatches) : currentPatches
  }
}

/**
 * 判断属性的更改
 *
 * 判断 props 分以下三步骤
 * 1. 遍历 oldProps 查看是否有属性值被删除
 * 2. 遍历 newProps 查看是否有属性值被修改
 * 3. 在第二步中同时查看是否有属性新增
 */
function diffProps (oldProps, newProps) {
  const changes = []

  Object.keys(oldProps).forEach(key => {
    const newProp = newProps[key]
    if (!newProp) {
      changes.push({ props: key })
    }
  })
  Object.keys(newProps).forEach(key => {
    const oldProp = oldProps[key]
    const newProp = newProps[key]
    if ((oldProp && oldProp !== newProp) || !oldProp) {
      changes.push({ prop: key, value: newProp })
    }
  })

  return changes
}

/**
 * 遍历子元素打标识
 *
 * 这个函数来说，主要功能就两个
 * 1. 判断新旧子树的差异
 * 2. 给节点打上标记
 */
function diffChildren (oldChildren, newChildren, index, patches) {
  const { changes, list } = diffList(oldChildren, newChildren)

  if (changes.length) {
    patches[index] = patches[index] ? patches[index].concat(changes) : changes
  }

  // 记录上一个遍历过的节点
  let last
  oldChildren && oldChildren.forEach(item => {
    if (item && item.children) {
      index = last && last.children ? index + last.children.length + 1 : index + 1
      const node = newChildren[list.indexOf(item.key)]
      node && diffHandler(item, node, index, patches)
    } else {
      index += 1
    }
    last = item
  })
}

/**
 * 判断子树的差异
 *
 * 这里的主要步骤其实和判断属性差异是类似的，也是分为三步
 * 1. 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
 * 2. 遍历新的节点列表，判断是否有新的节点
 * 3. 在第二步中同时判断节点是否有移动
 */
function diffList (oldList, newList) {
  const changes = []

  // 为了遍历方便，先取出两个 list 的所有 keys
  const getKeys = (list = []) => {
    return list.reduce((result, item) => {
      const key = item instanceof Element ? item.key : item
      return result.concat(key)
    }, [])
  }
  const oldKeys = getKeys(oldList)
  const newKeys = getKeys(newList)

  // 用于保存变更后的节点数据，使用该数组保存有以下好处
  // 1. 可以正确获得被删除节点索引
  // 2. 交换节点位置只需要操作一遍 DOM
  // 3. 用于 diffChildren 函数中的判断，只需要遍历两个树中都存在的节点。而对于新增或者删除的节点来说，没必要再去判断一遍
  const list = []

  oldKeys.forEach((key, index) => {
    // 寻找新的 children 中是否含有当前节点，没有的话需要删除
    if (key && newKeys.includes(key)) {
      list.push(key)
    } else {
      changes.push({ type: StateEnums.Remove, index })
    }
  })

  // 遍历新的 list，判断是否有节点新增或移动，同时也对 `list` 做节点新增和移动节点的操作
  newKeys.forEach((key, index) => {
    // 寻找旧的 children 中是否含有当前节点，没找到代表是新节点，需要插入
    const location = list.indexOf(key)
    if (location === -1 || !key) {
      changes.push({ type: StateEnums.Insert, node: newList[index], index })
      list.splice(index, 0, key)
    } else {
      // 找到了，需要判断是否需要移动
      if (location !== index) {
        changes.push({ type: StateEnums.Move, from: location, to: index })
        move(list, location, index)
      }
    }
  })

  return { changes, list }
}
