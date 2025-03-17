export const appRoutes = {
  registration: () => '/registration',
  unread: () => '/unread',
  request: (id: string) => `/request/${id}`,
  requestCreate: () => '/request/create',
  requests: () => '/requests',
};
