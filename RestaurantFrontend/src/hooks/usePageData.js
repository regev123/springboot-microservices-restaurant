import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from '../components/layout/PageLoader/PageLoader';

/**
 * Base strategy interface for page data fetching
 */
class PageDataStrategy {
  constructor(fetchActions, selector, loadingKeys, loadingText) {
    this.fetchActions = fetchActions;
    this.selector = selector;
    this.loadingKeys = loadingKeys;
    this.loadingText = loadingText;
  }

  // Method to check if loading
  isLoading(state) {
    throw new Error('isLoading method must be implemented');
  }

  // Method to get data
  getData(state) {
    throw new Error('getData method must be implemented');
  }
}

/**
 * Simple strategy for single loading state
 */
class SimplePageDataStrategy extends PageDataStrategy {
  isLoading(state) {
    return state[this.loadingKeys] === true;
  }

  getData(state) {
    return state;
  }
}

/**
 * Complex strategy for multiple loading states
 */
class ComplexPageDataStrategy extends PageDataStrategy {
  isLoading(state) {
    return this.loadingKeys.some((key) => {
      const keys = key.split('.');
      let current = state;
      for (const k of keys) {
        current = current?.[k];
      }
      return current === true;
    });
  }

  getData(state) {
    return state;
  }
}

/**
 * Hook that uses strategy pattern for page data fetching
 */
const usePageData = (strategy) => {
  const dispatch = useDispatch();
  const state = useSelector(strategy.selector);

  useEffect(() => {
    if (Array.isArray(strategy.fetchActions)) {
      strategy.fetchActions.forEach((action) => dispatch(action()));
    } else {
      dispatch(strategy.fetchActions());
    }
  }, [dispatch, strategy.fetchActions]);

  const renderPage = (content) => {
    if (strategy.isLoading(state)) {
      return <PageLoader show={true} text={strategy.loadingText} />;
    }
    return content;
  };

  return {
    renderPage,
  };
};

export default usePageData;
export { SimplePageDataStrategy, ComplexPageDataStrategy };
