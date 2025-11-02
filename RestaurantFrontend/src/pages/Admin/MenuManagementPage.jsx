import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchMenus,
  fetchMenuItems,
  fetchKitchenStations,
} from '../../store/thunks/menuThunks';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import EmptyStateCard from '../../components/common/EmptyStateCard/EmptyStateCard';
import MenuManagerForm from '../../features/menu/components/MenuManager/MenuManagerForm';
import CategoryManagerForm from '../../features/menu/components/CategoryManager/CategoryManagerForm';
import MenuItemManagerForm from '../../features/menu/components/MenuItemManager/MenuItemManagerForm';
import KitchenStationManagerForm from '../../features/menu/components/KitchenStationManager/KitchenStationManagerForm';
import KitchenStationExplorer from '../../features/menu/components/KitchenStationManager/KitchenStationExplorer';
import usePageData, { ComplexPageDataStrategy } from '../../hooks/usePageData';
import MenuExplorerManagerForm from '../../features/menu/components/MenuExplorer/MenuExplorerManagerForm';

const MenuManagementPage = () => {
  // Get categories from Redux state
  const { categories, menus, menuItems } = useSelector((state) => state.menu);

  // Tab state
  const [activeTab, setActiveTab] = useState('menus');

  // Tab configuration
  const tabs = [
    {
      id: 'menus',
      label: 'Menus',
      icon: '📋',
      description: 'Create and manage restaurant menus',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: '🗂️',
      description: 'Organize menu items into categories',
    },
    {
      id: 'items',
      label: 'Menu Items',
      icon: '🍽️',
      description: 'Add and manage individual menu items',
    },
    {
      id: 'stations',
      label: 'Kitchen Stations',
      icon: '🏪',
      description: 'Manage kitchen stations for organizing preparation',
    },
    {
      id: 'station-explorer',
      label: 'Station Explorer',
      icon: '🔧',
      description: 'Assign menu items to kitchen stations',
    },
    {
      id: 'explorer',
      label: 'Menu Explorer',
      icon: '🔍',
      description: 'Assign items to menus with drag & drop',
    },
  ];

  // Create strategy for menu management page data fetching (memoized to prevent infinite loops)
  const menuDataStrategy = useMemo(
    () =>
      new ComplexPageDataStrategy(
        [fetchCategories, fetchMenus, fetchMenuItems, fetchKitchenStations], // Multiple fetch actions
        (state) => state.menu, // Selector for menu state
        [
          'categoriesUI.FetchingCategories',
          'menuUI.FetchingMenus',
          'menuItemsUI.FetchingMenuItems',
          'kitchenStationsUI.FetchingKitchenStations',
        ], // Loading keys to check
        'Loading menu data...' // Loading text
      ),
    []
  ); // Empty dependency array - strategy never changes

  const { renderPage } = usePageData(menuDataStrategy);

  return renderPage(
    <PageLayout>
      {/* Tab Navigation */}
      <GlassCard className="p-0 mb-6">
        <div className="flex border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{tab.icon}</span>
                <div>
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'menus' && (
          <GlassCard>
            <MenuManagerForm />
          </GlassCard>
        )}

        {activeTab === 'categories' && (
          <GlassCard data-category-section>
            <CategoryManagerForm />
          </GlassCard>
        )}

        {activeTab === 'items' && (
          <>
            {categories.length > 0 ? (
              <GlassCard>
                <MenuItemManagerForm />
              </GlassCard>
            ) : (
              <EmptyStateCard
                title="No Categories Available"
                description="Please create categories first before adding menu items. Use the Categories tab to create your first category."
              />
            )}
          </>
        )}

        {activeTab === 'stations' && (
          <GlassCard>
            <KitchenStationManagerForm />
          </GlassCard>
        )}

        {activeTab === 'station-explorer' && (
          <>
            {categories.length > 0 && menuItems.length > 0 ? (
              <GlassCard>
                <KitchenStationExplorer />
              </GlassCard>
            ) : (
              <EmptyStateCard
                title="Station Explorer Not Available"
                description="Please create categories and menu items before using the Station Explorer. Use the Categories and Menu Items tabs to set up your restaurant's offerings."
              />
            )}
          </>
        )}

        {activeTab === 'explorer' && (
          <>
            {categories.length > 0 && menus.length > 0 && menuItems.length > 0 ? (
              <GlassCard>
                <MenuExplorerManagerForm />
              </GlassCard>
            ) : (
              <EmptyStateCard
                title="Menu Explorer Not Available"
                description="Please create categories, menus, and menu items before using the Menu Explorer. Use the Categories, Menus, and Menu Items tabs to set up your restaurant's offerings."
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default MenuManagementPage;
