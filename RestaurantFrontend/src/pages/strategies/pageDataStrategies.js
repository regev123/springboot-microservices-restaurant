import { SimplePageDataStrategy, ComplexPageDataStrategy } from '../../hooks/usePageData';
import { fetchUsers } from '../../store/thunks/adminThunks';
import { fetchCategories, fetchMenus } from '../../store/thunks/menuThunks';

/**
 * Strategy for Users Management Page
 */
export class UsersPageStrategy extends SimplePageDataStrategy {
  constructor() {
    super(fetchUsers, (state) => state.admin, 'loading', 'Loading users...');
  }
}

/**
 * Strategy for Menu Management Page
 */
export class MenuPageStrategy extends ComplexPageDataStrategy {
  constructor() {
    super(
      [fetchCategories, fetchMenus],
      (state) => state.menu,
      ['categoriesUI.FetchingCategories', 'menuUI.FetchingMenus'],
      'Loading menu data...'
    );
  }
}
