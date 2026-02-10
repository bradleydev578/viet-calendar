/**
 * Widget Module
 *
 * Exports for iOS Calendar Widget integration
 */

// Bridge interface
export {
  WidgetBridge,
  type CalendarWidgetData,
  type CalendarDayData,
} from './WidgetBridge';

// Data preparation
export { prepareWidgetData } from './WidgetDataPreparer';

// Auto-sync hook
export { useWidgetSync } from './useWidgetSync';
