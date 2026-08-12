import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ⚠️ IMPORTANT : sur un téléphone physique/émulateur, "localhost" pointe vers
// le téléphone lui-même, pas vers ton ordinateur. Remplace par l'adresse IP
// locale de ta machine, trouvable avec `ip a` (Linux) ou `ipconfig` (Windows).
const API_URL = " https://booted-false-playmate.ngrok-free.dev/api";

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("access_token");
}

export class ApiError extends Error {
  status: number;
  fields: Record<string, string[]>;

  constructor(status: number, body: any) {
    // Django renvoie soit {"champ": ["message"]}, soit {"detail": "message"}
    const fields: Record<string, string[]> = {};
    if (body && typeof body === "object") {
      for (const key of Object.keys(body)) {
        const value = body[key];
        fields[key] = Array.isArray(value) ? value : [String(value)];
      }
    }
    const firstMessage = Object.values(fields)[0]?.[0] || "Une erreur est survenue.";
    super(firstMessage);
    this.status = status;
    this.fields = fields;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // On lit le corps UNE SEULE FOIS (en texte brut), puis on essaie de le
  // parser en JSON. Lire res.json() puis res.text() en fallback casse sur
  // mobile natif ("body stream already read").
  const rawText = await res.text();

  if (!res.ok) {
    let body: any = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = { detail: rawText || `Erreur ${res.status}` };
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204 || !rawText) return undefined as T;
  return JSON.parse(rawText) as T;
}

export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
  method: string = "POST"
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const rawText = await res.text();

  if (!res.ok) {
    let body: any = {};
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch {
      body = { detail: rawText || `Erreur ${res.status}` };
    }
    throw new ApiError(res.status, body);
  }

  if (!rawText) return undefined as T;
  return JSON.parse(rawText) as T;
}

export type Category = { id: number; name: string; slug: string };

export type Shop = {
  id: number;
  name: string;
  description: string;
  logo: string | null;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  is_available: boolean;
  category: Category | null;
  shop_name: string;
};

export type Me = {
  id: number;
  username: string;
  email: string;
  is_seller: boolean;
  shop_name: string;
  phone: string;
};

export const api = {
  login: async (email: string, password: string) => {
    const data = await apiFetch<{ access: string; refresh: string }>(
      "/auth/login/",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    await AsyncStorage.setItem("access_token", data.access);
    await AsyncStorage.setItem("refresh_token", data.refresh);
    return data;
  },

  logout: async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
  },

  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem("access_token");
    return !!token;
  },

  me: () => apiFetch<Me>("/auth/me/"),

  register: (data: {
    username: string;
    email: string;
    password: string;
    is_seller: boolean;
    shop_name?: string;
  }) =>
    apiFetch("/auth/register/", { method: "POST", body: JSON.stringify(data) }),

  getMyShops: () => apiFetch<Shop[] | { results: Shop[] }>("/shops/?mine=true"),

  createShop: (data: { name: string; description?: string }) =>
    apiFetch<Shop>("/shops/", { method: "POST", body: JSON.stringify(data) }),

  getCategories: () => apiFetch<Category[]>("/categories/"),

  getProducts: (params?: { category?: string; search?: string; mine?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category__slug", params.category);
    if (params?.search) qs.set("search", params.search);
    if (params?.mine) qs.set("mine", "true");
    const query = qs.toString();
    return apiFetch<Product[] | { results: Product[] }>(
      `/products/${query ? `?${query}` : ""}`
    );
  },

  getProduct: (id: number | string) => apiFetch<Product>(`/products/${id}/`),

  createProduct: (data: {
    title: string;
    description: string;
    price: string;
    stock: number;
    category_id: number;
    shop_id: number;
  }) =>
    apiFetch<Product>("/products/", { method: "POST", body: JSON.stringify(data) }),

  updateProduct: (
    id: number,
    data: Partial<{
      title: string;
      description: string;
      price: string;
      stock: number;
      category_id: number;
      shop_id: number;
    }>
  ) => apiFetch<Product>(`/products/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteProduct: (id: number) => apiFetch<void>(`/products/${id}/`, { method: "DELETE" }),

  uploadProductImage: async (id: number, imageUri: string) => {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("image", blob, "photo.jpg");
    } else {
      const filename = imageUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      // @ts-ignore
      formData.append("image", { uri: imageUri, name: filename, type });
    }

    return apiFetchFormData<Product>(`/products/${id}/`, formData, "PATCH");
  },

  myOrders: () => apiFetch("/orders/mine/"),

  checkout: (items: { product_id: number; quantity: number }[]) =>
    apiFetch<{ checkout_url: string; order_id: number }>("/orders/checkout/", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),

  verifyOrder: (id: number) => apiFetch(`/orders/${id}/verify/`),
};
