// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Create a new order POST /orders */
export async function createOrder(body: API.OrderRequest, options?: { [key: string]: any }) {
  return request<API.Order>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
