import CalendarPage from '@/components/pages/CalendarPage';
import CheckInPage from '@/components/pages/CheckInPage';
import InsightsPage from '@/components/pages/InsightsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import ProfilePage from '@/components/pages/ProfilePage';

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
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: ProfilePage
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