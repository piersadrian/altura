import React from 'react'
import ReactDOM from 'react-dom'
import { resource, action } from 'redux-patterns'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk'
import axios from 'axios'

const fullyQualifiedUrl = (path) => `https://jsonplaceholder.typicode.com/${path}`

const request = (url, method, body = undefined) =>
  axios({ url, method, body }).then((response) => response.data)

const index = (buildUrl) => (context, getState) => request(buildUrl(context), 'get')
const show = (buildUrl) => (context, getState) => request(buildUrl(context), 'get')

const defaultPostState = {
  userId: null,
  title: '',
  body: ''
}

const { actions, reducers } = resource('document', [
  action('index', [], index(() => fullyQualifiedUrl('posts'))),
  action('show', defaultPostState, show(({ id }) => fullyQualifiedUrl(`posts/${id}`)))
], {})

const logger = () => (next) => (action) => {
  console.log(action)
  return next(action)
}

const store = createStore(combineReducers(reducers), applyMiddleware(thunk, logger))
window.store = store

const Post = ({ title, body }) => (
  <div>
    <button onClick={() => store.dispatch(actions.document.show({ id: 2 }))}>
      Load Post
    </button>
    <h1>{ title }</h1>
    <p>{ body }</p>
  </div>
)

Post.propTypes = {
  title: React.PropTypes.string.isRequired,
  body: React.PropTypes.string.isRequired
}

const mapStateToProps = (state) => state.document.show.data
const ConnectedPost = connect(mapStateToProps)(Post)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedPost />
  </Provider>,
  document.getElementById('root')
)
