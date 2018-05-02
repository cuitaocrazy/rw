import React from 'react'
import { connect } from 'react-redux'
import { addOrUpdate, del } from '../actions'

export default connect(state => ({ words: state }), { addOrUpdate, del })(props => <div>{JSON.stringify(props.words)}</div>)
