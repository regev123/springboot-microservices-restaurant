import { useCallback } from 'react';

// Constants following DRY principle
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DATE_SEPARATOR = '/';
const TIME_SEPARATOR = ':';
const DATE_TIME_SEPARATOR = ' ';

/**
 * Date validation utility - Single Responsibility Principle
 * @param {string} dateString - ISO date string
 * @returns {Date|null} Valid Date object or null
 */
const validateAndParseDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('useDateFormat: Invalid date string provided:', dateString);
    return null;
  }
};

/**
 * Date formatting utilities - Single Responsibility Principle
 */
const DateFormatter = {
  /**
   * Format date components with zero padding
   * @param {Date} date - Valid Date object
   * @returns {Object} Formatted date components
   */
  formatComponents: (date) => ({
    day: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear(),
    hours: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    seconds: date.getSeconds().toString().padStart(2, '0'),
  }),

  /**
   * Format date only (DD/MM/YYYY)
   * @param {Object} components - Date components
   * @returns {string} Formatted date string
   */
  formatDateOnly: (components) =>
    `${components.day}${DATE_SEPARATOR}${components.month}${DATE_SEPARATOR}${components.year}`,

  /**
   * Format time only (HH:MM)
   * @param {Object} components - Date components
   * @returns {string} Formatted time string
   */
  formatTimeOnly: (components) => `${components.hours}${TIME_SEPARATOR}${components.minutes}`,

  /**
   * Format time with seconds (HH:MM:SS)
   * @param {Object} components - Date components
   * @returns {string} Formatted time with seconds string
   */
  formatTimeWithSeconds: (components) =>
    `${components.hours}${TIME_SEPARATOR}${components.minutes}${TIME_SEPARATOR}${components.seconds}`,

  /**
   * Format readable date (15 Jan 2024)
   * @param {Date} date - Valid Date object
   * @returns {string} Formatted readable date string
   */
  formatReadable: (date) => {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },
};

/**
 * Custom hook for date formatting utilities
 * Follows SOLID principles and clean code concepts
 *
 * Single Responsibility: Only handles date formatting
 * Open/Closed: Easy to extend with new formatting methods
 * Dependency Inversion: Depends on abstractions (DateFormatter)
 */
const useDateFormat = () => {
  /**
   * Format date without time (DD/MM/YYYY)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string or empty string if invalid
   */
  const formatDateWithoutHour = useCallback((dateString) => {
    const date = validateAndParseDate(dateString);
    if (!date) return '';

    const components = DateFormatter.formatComponents(date);
    return DateFormatter.formatDateOnly(components);
  }, []);

  /**
   * Format date with time (DD/MM/YYYY HH:MM)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date and time string or empty string if invalid
   */
  const formatDateWithHour = useCallback((dateString) => {
    const date = validateAndParseDate(dateString);
    if (!date) return '';

    const components = DateFormatter.formatComponents(date);
    const datePart = DateFormatter.formatDateOnly(components);
    const timePart = DateFormatter.formatTimeOnly(components);
    return `${datePart}${DATE_TIME_SEPARATOR}${timePart}`;
  }, []);

  /**
   * Format date with seconds (DD/MM/YYYY HH:MM:SS)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date and time with seconds or empty string if invalid
   */
  const formatDateWithSeconds = useCallback((dateString) => {
    const date = validateAndParseDate(dateString);
    if (!date) return '';

    const components = DateFormatter.formatComponents(date);
    const datePart = DateFormatter.formatDateOnly(components);
    const timePart = DateFormatter.formatTimeWithSeconds(components);
    return `${datePart}${DATE_TIME_SEPARATOR}${timePart}`;
  }, []);

  /**
   * Format date in readable format (15 Jan 2024)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted readable date or empty string if invalid
   */
  const formatDateReadable = useCallback((dateString) => {
    const date = validateAndParseDate(dateString);
    if (!date) return '';

    return DateFormatter.formatReadable(date);
  }, []);

  return {
    formatDateWithoutHour,
    formatDateWithHour,
    formatDateWithSeconds,
    formatDateReadable,
  };
};

export default useDateFormat;
