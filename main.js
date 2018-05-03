const text =
  'React components this this implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the thecomponent can be accessed by render() via this.props.'

const regex = new RegExp('\\bthe\\b|\\bthis\\b', 'g')

let a
while ((a = regex.exec(text))) {
  console.log(a)
}
