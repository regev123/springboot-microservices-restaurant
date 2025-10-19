import { BASIC_NAME_VALIDATION_OPTIONS } from '../../constants/names';

/**
 * Menu management validation configurations
 * Uses universal name validation for all menu-related names
 */

/**
 * Menu validation rules
 */
export const MENU_VALIDATION_RULES = {
  menuName: {
    type: 'name',
    options: BASIC_NAME_VALIDATION_OPTIONS,
  },
};

export const MENU_INITIAL_DATA = {
  menuName: '',
};
