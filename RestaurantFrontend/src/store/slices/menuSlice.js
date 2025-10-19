import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchMenus,
  createMenu,
  deleteMenu,
  activateMenu,
  updateMenu,
  updateCategoryOrder,
} from '../thunks/menuThunks.js';

const setPending = (uiState, key) => {
  uiState[key] = true;
};

const setFulfilled = (uiState, key) => {
  uiState[key] = false;
};

const setRejected = (uiState, key) => {
  uiState[key] = false;
};

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menus: [],
    categories: [],
    menuItems: [],
    categoriesUI: {
      FetchingCategories: false,
    },
    menuUI: {
      FetchingMenus: false,
    },
    menuItemsUI: {
      FetchingMenuItems: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    /* ===== CATEGORIES ===== */
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) =>
        setPending(state.categoriesUI, 'FetchingCategories')
      )
      .addCase(fetchCategories.fulfilled, (state, action) => {
        setFulfilled(state.categoriesUI, 'FetchingCategories');
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) =>
        setRejected(state.categoriesUI, 'FetchingCategories')
      )

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex((cat) => cat.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = {
            ...state.categories[index],
            name: updatedCategory.name,
            description: updatedCategory.description,
            updatedAt: new Date().toISOString(),
          };
        }
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      })

      // UPDATE ORDER
      .addCase(updateCategoryOrder.fulfilled, (state, action) => {
        state.categories = action.payload;
      });

    /* ===== MENUS ===== */
    builder
      // FETCH
      .addCase(fetchMenus.pending, (state) => setPending(state.menuUI, 'FetchingMenus'))
      .addCase(fetchMenus.fulfilled, (state, action) => {
        setFulfilled(state.menuUI, 'FetchingMenus');
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => setRejected(state.menuUI, 'FetchingMenus'))

      // CREATE
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload);
      })

      // ACTIVATE
      .addCase(activateMenu.fulfilled, (state, action) => {
        state.menus = action.payload;
      })

      // DELETE
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter((menu) => menu.id !== action.payload);
      })

      // UPDATE
      .addCase(updateMenu.fulfilled, (state, action) => {
        const { menuId, menuData } = action.payload;
        const index = state.menus.findIndex((menu) => menu.id === menuId);
        if (index !== -1) {
          state.menus[index] = {
            ...state.menus[index],
            name: menuData.name,
            updatedAt: new Date().toISOString(),
          };
        }
      });
  },
});

export const { setCategoriesError, setMenuError } = menuSlice.actions;
export default menuSlice.reducer;
