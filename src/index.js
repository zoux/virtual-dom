import Element from './element'
import diff from './diff'
import patch from './patch'

const test3 = new Element('div', { class: 'my-div' }, ['test3'], '')
const test4 = new Element('ul', { class: 'my-div' }, ['test4'], '')
const test1 = new Element('div', { class: 'my-div' }, [test3], '')
const test2 = new Element('div', { id: '1' }, [test3, test4], '')

const root = test1.render()

setTimeout(() => {
  console.log('开始更新')
  const patches = diff(test1, test2)
  console.log(patches)
  patch(root, patches)
  console.log('结束更新')
}, 2000)

setTimeout(() => {
  console.log('开始更新')
  const patches = diff(test2, test1)
  console.log(patches)
  patch(root, patches)
  console.log('结束更新')
}, 4000)
