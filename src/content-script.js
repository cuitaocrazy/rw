const tagSet = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'SMALL', 'STRONG', 'Q', 'DIV', 'SPAN', 'LI'])

const filter = node => tagSet.has(node.parentNode.tagName) && node.textContent.trim().length > 3
/**
 *
 * @param {Node} el html element
 */
function* getTextNodes(el) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => (filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP), false)
  while (walk.nextNode()) {
    yield walk.currentNode
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  for (const node of Array.from(getTextNodes(document.body))) {
    // node.parentElement.removeChild(node)
  }
})
