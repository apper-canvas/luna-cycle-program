import CalendarPage from '@/components/pages/CalendarPage';
import CheckInPage from '@/components/pages/CheckInPage';
import InsightsPage from '@/components/pages/InsightsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  checkin: {
    id: 'checkin',
    label: 'Check-in',
    path: '/checkin',
    icon: 'Plus',
    component: CheckInPage,
    isCenter: true
  },
  insights: {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: 'TrendingUp',
    component: InsightsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
};

export const routeArray = Object.values(routes);
export default routes;