import { useMemo } from 'react';
import { fetchCategories, fetchMenus } from '../../store/thunks/menuThunks';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import SectionHeader from '../../components/common/SectionHeader/SectionHeader';
import MenuManagerForm from '../../features/menu/components/MenuManager/MenuManagerForm';
import CategoryManagerForm from '../../features/menu/components/CategoryManager/CategoryManagerForm';
import CreateMenuItemForm from '../../features/menu/components/CreateMenuItem/CreateMenuItemForm';
import MenuExplorer from '../../features/menu/components/MenuExplorer/MenuExplorer';
import usePageData, { ComplexPageDataStrategy } from '../../hooks/usePageData';

const MenuManagementPage = () => {
  // Create strategy for menu management page data fetching (memoized to prevent infinite loops)
  const menuDataStrategy = useMemo(
    () =>
      new ComplexPageDataStrategy(
        [fetchCategories, fetchMenus], // Multiple fetch actions
        (state) => state.menu, // Selector for menu state
        ['categoriesUI.FetchingCategories', 'menuUI.FetchingMenus'], // Loading keys to check
        'Loading menu data...' // Loading text
      ),
    []
  ); // Empty dependency array - strategy never changes

  const { renderPage } = usePageData(menuDataStrategy);

  return renderPage(
    <PageLayout>
      {/* Menu Management Section */}
      <GlassCard className="mb-8">
        <SectionHeader
          title="Menu Management"
          description="Create and manage your restaurant menus with ease"
        />
        <MenuManagerForm />
      </GlassCard>

      {/* Category Management Section */}
      <GlassCard className="mb-8" data-category-section>
        <SectionHeader
          title="Category Management"
          description="Organize your menu into categories"
        />
        <CategoryManagerForm />
      </GlassCard>

      {/* Menu Items Section */}
      <GlassCard className="mb-8">
        <SectionHeader title="Menu Items" description="Add and manage individual menu items" />
        <CreateMenuItemForm />
      </GlassCard>

      {/* Menu Explorer Section */}
      <GlassCard>
        <SectionHeader title="Menu Explorer" description="Browse and explore existing menus" />
        <MenuExplorer />
      </GlassCard>
    </PageLayout>
  );
};

export default MenuManagementPage;
