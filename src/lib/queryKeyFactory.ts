export const MESSAGES_QUERY_KEY = 'messages';
export const REQUESTS_QUERY_KEY = 'requests';

export const MessagesQueryKeys = {
  unreadExist: () => [MESSAGES_QUERY_KEY, 'unreadExist'],
};

export const RequestsQueryKeys = {
  byId: (id: string) => [REQUESTS_QUERY_KEY, 'byId', id],
};
