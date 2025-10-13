// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** List all pets GET /pets */
export async function listPets(options?: { [key: string]: any }) {
  return request<API.PetsResponse>('/pets', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Info for a specific pet GET /pets/${param0} */
export async function getPet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPetParams,
  options?: { [key: string]: any },
) {
  const { petId: param0, ...queryParams } = params;
  return request<API.Pet>(`/pets/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
