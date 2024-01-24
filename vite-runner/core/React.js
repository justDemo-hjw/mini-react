function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type ,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    },
  }
}

let nextWork = null;

function workLoop(deadline) {
  let shouldYield = false
  while(!shouldYield && nextWork) {
    // 执行任务
    nextWork = performWorkUnit(nextWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function creatDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if(key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let preChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if(index === 0) {
      fiber.child = newFiber
    }else {
      preChild.sibling = newFiber
    }
    preChild = newFiber
  })
}

function performWorkUnit(fiber) {
  console.log('fiber', fiber)
  // 1. 创建dom
  if(!fiber.dom) {
    const dom = fiber.dom = creatDom(fiber.type)
    fiber.parent.dom.append(dom)
    // 2. 处理props
    updateProps(dom, fiber.props)
  }
  // 3. 生成链表，创建指针
  initChildren(fiber)
  // 4. 返回下一个任务
  if(fiber.child) {
    return fiber.child
  }
  if(fiber.sibling) {
    return fiber.sibling
  }
  return fiber?.parent?.sibling
}



function render(el, container) {
  nextWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
}

const React = {
  render,
  createElement
}

export default React