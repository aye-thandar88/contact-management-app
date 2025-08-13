import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Contact } from '../types/contact';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  tagTypes: ['Contacts'],
  endpoints: (build) => ({
    getContacts: build.query<Contact[], void>({
      query: () => '/contacts',
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Contacts' as const, id })), { type: 'Contacts', id: 'LIST' }] : [{ type: 'Contacts', id: 'LIST' }]
    }),
    getContact: build.query<Contact, number>({ query: (id) => `/contacts/${id}` }),
    createContact: build.mutation<Contact, Partial<Contact>>({
      query: (body) => ({ url: '/contacts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }]
    }),
    updateContact: build.mutation<Contact, Partial<Contact> & Pick<Contact,'id'>>({
      query: ({ id, ...patch }) => ({ url: `/contacts/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contacts', id }]
    }),
    deleteContact: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `/contacts/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Contacts', id }, { type: 'Contacts', id: 'LIST' }]
    })
  })
})

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation
} = contactApi