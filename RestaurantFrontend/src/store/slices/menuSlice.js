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
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchKitchenStations,
  createKitchenStation,
  updateKitchenStation,
  deleteKitchenStation,
  fetchKitchenStationMenuItems,
  updateKitchenStationMenuItems,
  fetchMenuMenuItems,
  updateMenuMenuItems,
  fetchActiveMenu,
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
    activeMenu: null,
    categories: [],
    menuItems: [],
    kitchenStations: [],
    categoriesUI: {
      FetchingCategories: false,
    },
    menuUI: {
      FetchingMenus: false,
      FetchingActiveMenu: false,
    },
    menuItemsUI: {
      FetchingMenuItems: false,
    },
    kitchenStationsUI: {
      FetchingKitchenStations: false,
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
        // Loop through categories and update the one that matches the ID
        state.categories = state.categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        );
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = action.payload; // Use the complete updated list from backend
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
        const { id, name } = action.payload;
        const index = state.menus.findIndex((menu) => menu.id === id);
        if (index !== -1) {
          state.menus[index] = {
            ...state.menus[index],
            name,
            updatedAt: new Date().toISOString(),
          };
        }
      })

      // FETCH ACTIVE MENU
      .addCase(fetchActiveMenu.pending, (state) =>
        setPending(state.menuUI, 'FetchingActiveMenu')
      )
      .addCase(fetchActiveMenu.fulfilled, (state, action) => {
        setFulfilled(state.menuUI, 'FetchingActiveMenu');
        state.activeMenu = action.payload;
      })
      .addCase(fetchActiveMenu.rejected, (state, action) =>
        setRejected(state.menuUI, 'FetchingActiveMenu')
      );

    /* ===== MENU ITEMS ===== */
    builder
      // FETCH
      .addCase(fetchMenuItems.pending, (state) =>
        setPending(state.menuItemsUI, 'FetchingMenuItems')
      )
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        setFulfilled(state.menuItemsUI, 'FetchingMenuItems');
        state.menuItems = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) =>
        setRejected(state.menuItemsUI, 'FetchingMenuItems')
      )

      // CREATE
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.menuItems.push(action.payload);
      })

      // UPDATE
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updatedMenuItem = action.payload;
        state.menuItems = state.menuItems.map((menuItem) =>
          menuItem.id === updatedMenuItem.id ? updatedMenuItem : menuItem
        );
      })

      // DELETE
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menuItems = state.menuItems.filter((menuItem) => menuItem.id !== action.payload);
      });

    /* ===== KITCHEN STATIONS ===== */
    builder
      // FETCH
      .addCase(fetchKitchenStations.pending, (state) =>
        setPending(state.kitchenStationsUI, 'FetchingKitchenStations')
      )
      .addCase(fetchKitchenStations.fulfilled, (state, action) => {
        setFulfilled(state.kitchenStationsUI, 'FetchingKitchenStations');
        state.kitchenStations = action.payload;
      })
      .addCase(fetchKitchenStations.rejected, (state, action) =>
        setRejected(state.kitchenStationsUI, 'FetchingKitchenStations')
      )

      // CREATE
      .addCase(createKitchenStation.fulfilled, (state, action) => {
        state.kitchenStations.push(action.payload);
      })

      // UPDATE
      .addCase(updateKitchenStation.fulfilled, (state, action) => {
        const updatedKitchenStation = action.payload;
        state.kitchenStations = state.kitchenStations.map((kitchenStation) =>
          kitchenStation.id === updatedKitchenStation.id ? updatedKitchenStation : kitchenStation
        );
      })

      // DELETE
      .addCase(deleteKitchenStation.fulfilled, (state, action) => {
        state.kitchenStations = state.kitchenStations.filter(
          (kitchenStation) => kitchenStation.id !== action.payload
        );
      })

      // FETCH KITCHEN STATION MENU ITEMS
      .addCase(fetchKitchenStationMenuItems.fulfilled, (state, action) => {
        // Loop over kitchenStations and update menuItems for matching stationId
        state.kitchenStations = state.kitchenStations.map((kitchenStation) =>
          kitchenStation.id === action.payload.stationId
            ? { ...kitchenStation, menuItems: action.payload.menuItems }
            : kitchenStation
        );
      })

      // UPDATE KITCHEN STATION MENU ITEMS
      .addCase(updateKitchenStationMenuItems.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((updatedStation) => {
            state.kitchenStations = state.kitchenStations.map((station) =>
              station.id === updatedStation.id
                ? { ...station, menuItems: updatedStation.menuItems }
                : station
            );
          });
        }
      })

      // FETCH MENU MENU ITEMS
      .addCase(fetchMenuMenuItems.fulfilled, (state, action) => {
        state.menus = state.menus.map((menu) =>
          menu.id === action.payload.menuId
            ? { ...menu, menuItems: action.payload.menuItems }
            : menu
        );
      })

      // UPDATE MENU MENU ITEMS
      .addCase(updateMenuMenuItems.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((updatedMenu) => {
            state.menus = state.menus.map((menu) =>
              menu.id === updatedMenu.id ? { ...menu, menuItems: updatedMenu.menuItems } : menu
            );
          });
        }
      });
  },
});

export const { setCategoriesError, setMenuError } = menuSlice.actions;
export default menuSlice.reducer;
