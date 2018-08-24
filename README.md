# Virtual Dom

参考资料：

https://github.com/KieSun/My-wheels/tree/master/Virtual%20Dom

## 实现原理

Virtual Dom 算法的实现主要是以下三步：

#### 1. 通过 JS 来模拟创建 DOM 对象

#### 2. 判断两个对象的差异

- 树的递归：
> 1. 没有新的节点，那么什么都不用做
> 2. 新的节点的 tagName 和 key（可能都没有）和旧的相同，开始遍历子树
> 3. 新的节点的 tagName 和 key 和旧的不同，就替换节

- 判断属性的更改：
> 1. 遍历 oldProps 查看是否有属性值被删除
> 2. 遍历 newProps 查看是否有属性值被修改
> 3. 在第二步中同时查看是否有属性新

- 遍历子树：
> 1. 判断新旧子树差异
> 2. 给节点打上标

- 判断子树的差异：
> 1. 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
> 2. 遍历新的节点列表，判断是否有新的节点
> 3. 在第二步中同时判断节点是否有移动

#### 3. 渲染差异