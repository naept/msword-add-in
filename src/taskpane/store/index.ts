import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { projectsReducer } from './project/reducers';
import initSubscriber from 'redux-subscriber';

const reducers = combineReducers({
  projects:   projectsReducer,
})

const store = createStore(reducers, applyMiddleware(thunk))

initSubscriber(store)

export default store
