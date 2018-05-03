/**
 *
 * @param {*} text
 */
function* getWords(text) {
  const words = ['implement', 'that', 'this']

  const regWord = new RegExp(words.join('|'), 'gi')
  let match = regWord.exec(text)

  while (match) {
    yield match
    match = regWord.exec(text)
  }
}

const matchs = Array.from(
  getWords(
    'React components this this implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by render() via this.props.'
  )
)

const new_nodes = []

let beginIndx = 0

for (const match of matchs) {
  if (beginIndx != match.index) {
    new_nodes.push(match.input.slice(beginIndx, match.index))
  }
  new_nodes.push(match[0])
  beginIndx = match.index + match[0].length
}

if (beginIndx != matchs[0].input.length) {
  new_nodes.push(matchs[0].input.slice(beginIndx))
}

console.log(new_nodes)

const g = *() => yield 10