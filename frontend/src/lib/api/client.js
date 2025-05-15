
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getToken } from '$lib/auth.js';

async function apiFetch(path, opts = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  const res = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...opts
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Error al llamar ${path}`);
  }
  return data;
}


export function getWarehouseProducts() {
  return apiFetch('/warehouses/products', {
    method: 'GET'
  });
}

export function syncData() {
  return apiFetch('/invoices/sync', {
    method: 'POST'
  });
}

export function getCitiesByProduct(productId) {
  return apiFetch(`/products/${productId}/cities`, {
    method: 'GET'
  });
}

export function getDestinationCities(cityId) {
  return apiFetch(`/warehouses/${cityId}/warehouses`, {
    method: 'GET'
  });
}

export function getMovements(startDate, endDate) {
  return apiFetch(`/shipments/movements?from=${startDate}&to=${endDate}`, {
    method: 'GET'
  });
}

