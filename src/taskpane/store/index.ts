import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { projectsReducer } from './project/reducers';
import { navReducer } from './nav/reducers';
import initSubscriber from 'redux-subscriber';

const reducers = combineReducers({
  nav:        navReducer,
  projects:   projectsReducer,
})

const store = createStore(reducers, applyMiddleware(thunk))

initSubscriber(store)

export default store
