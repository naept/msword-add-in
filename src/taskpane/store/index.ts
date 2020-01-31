import { createStore, combineReducers, applyMiddleware } from 'redux'
import { authReducer } from './auth/reducers'
import thunk from 'redux-thunk';
import { projectsReducer } from './project/reducers';
import initSubscriber from 'redux-subscriber';

const reducers = combineReducers({
  auth:       authReducer,
  projects:   projectsReducer
})

const store = createStore(reducers, applyMiddleware(thunk))

initSubscriber(store)

export default store
