// This file is auto-generated by @hey-api/openapi-ts

import { z } from 'zod';

export const zOrder = z.object({
  complete: z.boolean().optional(),
  id: z.coerce.bigint().optional(),
  petId: z.coerce.bigint().optional(),
  quantity: z.number().int().optional(),
  shipDate: z.string().datetime().optional(),
  status: z.enum(['placed', 'approved', 'delivered']).optional(),
});

export const zCustomer = z.object({
  address: z
    .array(
      z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        street: z.string().optional(),
        zip: z.string().optional(),
      }),
    )
    .optional(),
  id: z.coerce.bigint().optional(),
  username: z.string().optional(),
});

export const zAddress = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  street: z.string().optional(),
  zip: z.string().optional(),
});

export const zCategory = z.object({
  id: z.coerce.bigint().optional(),
  name: z.string().optional(),
});

export const zUser = z.object({
  email: z.string().optional(),
  firstName: z.string().optional(),
  id: z.coerce.bigint().optional(),
  lastName: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  userStatus: z.number().int().optional(),
  username: z.string().optional(),
});

export const zTag = z.object({
  id: z.coerce.bigint().optional(),
  name: z.string().optional(),
});

export const zPet = z.object({
  category: zCategory.optional(),
  id: z.coerce.bigint().optional(),
  name: z.string(),
  photoUrls: z.array(z.string()),
  status: z.enum(['available', 'pending', 'sold']).optional(),
  tags: z.array(zTag).optional(),
});

export const zApiResponse = z.object({
  code: z.number().int().optional(),
  message: z.string().optional(),
  type: z.string().optional(),
});

export const zAddPetResponse = zPet;

export const zUpdatePetResponse = zPet;

export const zFindPetsByStatusResponse = z.array(zPet);

export const zFindPetsByTagsResponse = z.array(zPet);

export const zGetPetByIdResponse = zPet;

export const zUploadFileResponse = zApiResponse;

export const zGetInventoryResponse = z.object({});

export const zPlaceOrderResponse = zOrder;

export const zGetOrderByIdResponse = zOrder;

export const zCreateUserResponse = zUser;

export const zCreateUsersWithListInputResponse = z.union([zUser, z.unknown()]);

export const zLoginUserResponse = z.string();

export const zGetUserByNameResponse = zUser;