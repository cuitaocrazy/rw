const tagSet = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'SMALL', 'STRONG', 'Q', 'DIV', 'SPAN'])

const filter = node => tagSet.has(node.parentNode.tagName) && node.textContent.trim().length > 3
/**
 *
 * @param {Node} el
 */
function* getTextNode(el) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => (filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP), false)
  while (walk.nextNode()) {
    yield walk.currentNode
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  // console.log(Array.from(getTextNode(document.body)))
  for (const node of Array.from(getTextNode(document.body))) {
    // console.log(node.parentElement)
    node.parentElement.removeChild(node)
  }
})
