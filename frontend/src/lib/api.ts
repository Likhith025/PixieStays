import axios from 'axios';

const isServer = typeof window === 'undefined';
const API_URL = isServer ? 'http://localhost:5000/api' : '/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getContent = async () => {
    try {
        const response = await api.get('/content');
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch content:", error.message);
        if (error.code) console.error("Error code:", error.code);
        return {};
    }
};

export const getProperties = async () => {
    try {
        const response = await api.get('/properties');
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch properties:", error.message);
        return [];
    }
};

export const getProperty = async (id: string) => {
    try {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Failed to fetch property:", error.message);
        return null;
    }
};

export const createBooking = async (data: any) => {
    return await api.post('/bookings', data);
};

// Admin - Auth
export const loginAdmin = async (credentials: any) => {
    return await api.post('/auth/login', credentials);
};

export const checkAuth = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        return { isAuthenticated: false };
    }
};

export const logoutAdmin = async () => {
    return await api.post('/auth/logout');
};

// Admin - Content
export const updateContent = async (data: any) => {
    return await api.post('/content', data);
};

// Admin - Properties
export const createProperty = async (data: any) => {
    return await api.post('/properties', data);
};

export const updateProperty = async (id: string, data: any) => {
    return await api.put(`/properties/${id}`, data);
};

export const deleteProperty = async (id: string) => {
    return await api.delete(`/properties/${id}`);
};

// Admin - Bookings
export const getBookings = async (params = {}) => {
    try {
        const response = await api.get('/bookings', { params });
        return response.data;
    } catch (error) {
        return [];
    }
};

// Admin - Links
export const getLinks = async () => {
    try {
        const response = await api.get('/links');
        return response.data;
    } catch (error) {
        return [];
    }
};

export const createLink = async (data: any) => {
    return await api.post('/links', data);
};

export const updateLink = async (id: string, data: any) => {
    return await api.put(`/links/${id}`, data);
};

export const deleteLink = async (id: string) => {
    return await api.delete(`/links/${id}`);
};

// --- COUPON API ---
export const getCoupons = async () => {
    try {
        const response = await api.get('/coupons');
        return response.data;
    } catch (error) {
        return [];
    }
};

export const createCoupon = async (data: any) => {
    return await api.post('/coupons', data);
};

export const updateCoupon = async (id: string, data: any) => {
    return await api.put(`/coupons/${id}`, data);
};

export const deleteCoupon = async (id: string) => {
    return await api.delete(`/coupons/${id}`);
};

export const verifyCoupon = async (code: string, orderAmount: number) => {
    try {
        const response = await api.post('/coupons/verify', { code, orderAmount });
        return response.data;
    } catch (error: any) {
        return { valid: false, message: error.response?.data?.message || 'Invalid coupon' };
    }
};

// --- ENQUIRY API ---
export const createEnquiry = async (data: any) => {
    return await api.post('/enquiries', data);
};

export const getEnquiries = async () => {
    try {
        const response = await api.get('/enquiries');
        return response.data;
    } catch (error) {
        return [];
    }
};

export const updateEnquiry = async (id: string, data: any) => {
    return await api.put(`/enquiries/${id}`, data);
};

export const deleteEnquiry = async (id: string) => {
    return await api.delete(`/enquiries/${id}`);
};
