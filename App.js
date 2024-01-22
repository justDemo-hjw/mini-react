import React from './core/React.js'
import ReactDom from './core/ReactDom.js'

const domEL = React.createElement('div', {id:'app'}, 'app', 'xxx', '-i')

ReactDom.createRoot(document.querySelector('#root')).render(domEL)