export const appRoutes = {
  registration: () => '/registration',
  unread: () => '/unread',
  request: (id: string) => `/request/${id}`,
  requestCreate: () => '/request/create',
  requestUpdate: (id: string) => `/request/${id}/edit`,
  requests: () => '/requests',
  account: () => '/account',
  login: () => '/login',
};
