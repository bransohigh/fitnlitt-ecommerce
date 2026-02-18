/**
 * Admin API Client
 * Handles authenticated requests to admin endpoints
 */

import { supabaseAuth } from './supabase-auth';

/**
 * Get authorization headers with current session token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data } = await supabaseAuth.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No authentication token available');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Generic fetch wrapper with auth
 */
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (response.status === 401) {
    // Redirect to login on unauthorized
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  return response;
}

// ================== PRODUCTS ==================

export async function getProduct(id: string) {
  const response = await authenticatedFetch(`/api/admin/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function createProduct(productData: any) {
  const response = await authenticatedFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }
  
  return response.json();
}

export async function updateProduct(id: string, productData: any) {
  const response = await authenticatedFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }
  
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await authenticatedFetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
}

// ================== COLLECTIONS ==================

export async function getCollection(id: string) {
  const response = await authenticatedFetch(`/api/admin/collections/${id}`);
  if (!response.ok) throw new Error('Failed to fetch collection');
  return response.json();
}

export async function createCollection(collectionData: any) {
  const response = await authenticatedFetch('/api/admin/collections', {
    method: 'POST',
    body: JSON.stringify(collectionData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create collection');
  }
  
  return response.json();
}

export async function updateCollection(id: string, collectionData: any) {
  const response = await authenticatedFetch(`/api/admin/collections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(collectionData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update collection');
  }
  
  return response.json();
}

export async function deleteCollection(id: string) {
  const response = await authenticatedFetch(`/api/admin/collections/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete collection');
  }
  
  return response.json();
}

// ================== UPLOADS ==================

export async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  const { data } = await supabaseAuth.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No authentication token available');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const result = await response.json();
  return result.data;
}

export async function uploadMultipleImages(files: File[]): Promise<{ url: string; path: string }[]> {
  const { data } = await supabaseAuth.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('No authentication token available');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch('/api/admin/upload/multiple', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload images');
  }

  const result = await response.json();
  return result.data.uploaded;
}

export async function deleteImage(path: string) {
  const response = await authenticatedFetch('/api/admin/upload', {
    method: 'DELETE',
    body: JSON.stringify({ path }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete image');
  }

  return response.json();
}
