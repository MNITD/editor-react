import { applyMiddleware } from 'redux'
import logger   from 'redux-logger';

export default applyMiddleware(logger);