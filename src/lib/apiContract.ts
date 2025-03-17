import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const UnreadMessageSchema = z.object({
  requestId: z.string(),
  title: z.string(),
  lastMessageFrom: z.string(),
  lastMessageDate: z.string(),
  unreadCount: z.number(),
});

const PaginationSchema = z.object({
  currentPage: z.number(),
  limit: z.number(),
  totalUnread: z.number(),
  totalPages: z.number(),
});

export const contract = c.router({
  getUnreadMessages: {
    method: 'GET',
    path: '/api/messages/unread',
    responses: {
      200: z.object({
        unreadRequests: z.array(UnreadMessageSchema),
        pagination: PaginationSchema,
      }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Retrieve unread messages for user',
  },

  getMessagesByRequest: {
    method: 'GET',
    path: '/api/messages/:requestId',
    pathParams: z.object({
      requestId: z.string(),
    }),
    responses: {
      200: z.object({
        messages: z.array(
          z.object({
            id: z.string(),
            requestId: z.string(),
            senderId: z.string(),
            senderName: z.string(),
            senderRole: z.enum(['SUPPORTER', 'SHELTER']),
            text: z.string(),
            createdAt: z.string(),
          })
        ),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Retrieve all messages for a specific request',
  },
  markMessagesAsRead: {
    method: 'POST',
    path: '/api/messages/read',
    body: z.object({
      requestId: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Mark all unread messages in request as read',
  },
  unreadExists: {
    method: 'GET',
    path: '/api/messages/unread-exists',
    responses: {
      200: z.object({
        hasUnread: z.boolean(),
      }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Check if user has unread messages',
  },
  registerUser: {
    method: 'POST',
    path: '/api/auth/register',
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['SUPPORTER', 'SHELTER']),
      name: z.string().min(1),
    }),
    responses: {
      201: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Register new user and send email confirmation',
  },
  loginUser: {
    method: 'POST',
    path: '/api/auth/login',
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        role: z.enum(['SUPPORTER', 'SHELTER']),
        accessToken: z.string(),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Authenticate user',
  },
  confirmEmail: {
    method: 'POST',
    path: '/api/auth/confirm-email',
    body: z.object({
      token: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Confirm user email using verification token',
  },
  updateUserName: {
    method: 'POST',
    path: '/api/user/update-name',
    body: z.object({
      userId: z.string(),
      newName: z.string().min(1),
    }),
    responses: {
      200: z.object({
        message: z.string(),
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          role: z.string(),
          verified: z.boolean(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
        refreshSession: z.boolean(),
      }),
      400: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Update user’s name',
  },

  archiveRequest: {
    method: 'PATCH',
    path: '/api/requests/archive',
    body: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
        request: z.object({
          id: z.string(),
          statusId: z.string(),
        }),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Archive request if user is owner',
  },
  createRequest: {
    method: 'POST',
    path: '/api/requests',
    body: z.object({
      title: z.string().min(1),
      type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']),
      urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      dueDate: z.string().optional(),
      details: z.string().min(1),
      location: z.string().min(1),
    }),
    responses: {
      201: z.object({
        message: z.string(),
        request: z.object({
          id: z.string(),
          title: z.string(),
          type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']),
          urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
          dueDate: z.string().nullable(),
          details: z.string(),
          location: z.string(),
          creatorId: z.string(),
        }),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Create new request, only user with SHELTER role can create one',
  },
  updateRequest: {
    method: 'PATCH',
    path: '/api/requests',
    body: z.object({
      id: z.string(),
      title: z.string().optional(),
      type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']).optional(),
      urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
      dueDate: z.string().optional(),
      details: z.string().optional(),
      location: z.string().optional(),
      status: z
        .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
        .optional(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
        request: z.object({
          id: z.string(),
          title: z.string(),
          type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']),
          urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
          status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
          dueDate: z.string().nullable(),
          details: z.string(),
          location: z.string(),
          creatorId: z.string(),
        }),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Update request',
  },

  getRequestById: {
    method: 'GET',
    path: '/api/requests/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        request: z.object({
          id: z.string(),
          title: z.string(),
          type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']),
          urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
          status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
          dueDate: z.string().nullable(),
          details: z.string(),
          location: z.string(),
          creatorId: z.string(),
        }),
      }),
      400: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Retrieve request by ID',
  },
  getRequests: {
    method: 'GET',
    path: '/api/requests',
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
      location: z.string().optional(),
      type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']).optional(),
      status: z
        .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
        .optional(),
      text: z.string().optional(),
      dueDateStart: z.string().optional(),
      dueDateEnd: z.string().optional(),
      createdDateStart: z.string().optional(),
      createdDateEnd: z.string().optional(),
    }),
    responses: {
      200: z.object({
        requests: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            type: z.enum(['SUPPLIES', 'SERVICES', 'VOLUNTEERS']),
            urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
            status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
            dueDate: z.string().nullable(),
            details: z.string(),
            location: z.string(),
            creatorId: z.string(),
          })
        ),
        pagination: z.object({
          currentPage: z.number(),
          limit: z.number(),
          totalRequests: z.number(),
          totalPages: z.number(),
        }),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Fetch requests with filters and pagination',
  },
  getUniqueLocations: {
    method: 'GET',
    path: '/api/requests/locations',
    responses: {
      200: z.object({
        locations: z.array(z.string()),
      }),
      500: z.object({ message: z.string() }),
    },
    summary: 'Retrieve list of unique request locations',
  },
});
