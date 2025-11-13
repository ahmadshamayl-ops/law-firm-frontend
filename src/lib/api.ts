import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(email: string, fullName: string, password: string) {
    const response = await this.client.post('/api/auth/signup', {
      email,
      full_name: fullName,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.client.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  async logout() {
    await this.client.post('/api/auth/logout');
    localStorage.removeItem('access_token');
  }

  // File endpoints
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getFiles() {
    const response = await this.client.get('/api/files/');
    return response.data;
  }

  async getFile(fileId: number) {
    const response = await this.client.get(`/api/files/${fileId}`);
    return response.data;
  }

  async deleteFile(fileId: number) {
    await this.client.delete(`/api/files/${fileId}`);
  }

  // Invoice endpoints
  async getInvoices(statusFilter?: string) {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const response = await this.client.get('/api/invoices/', { params });
    return response.data;
  }

  async getInvoiceSummary() {
    const response = await this.client.get('/api/invoices/summary');
    return response.data;
  }

  async getInvoice(invoiceId: number) {
    const response = await this.client.get(`/api/invoices/${invoiceId}`);
    return response.data;
  }

  async createInvoice(invoice: any) {
    const response = await this.client.post('/api/invoices/', invoice);
    return response.data;
  }

  // Payment endpoints
  async getPayments() {
    const response = await this.client.get('/api/payments/');
    return response.data;
  }

  async getPayment(paymentId: number) {
    const response = await this.client.get(`/api/payments/${paymentId}`);
    return response.data;
  }

  // Match endpoints
  async autoMatchPayments() {
    const response = await this.client.post('/api/matches/auto-match');
    return response.data;
  }

  async getMatches(statusFilter?: string) {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const response = await this.client.get('/api/matches/', { params });
    return response.data;
  }

  async getMatchStats() {
    const response = await this.client.get('/api/matches/stats');
    return response.data;
  }

  async approveMatch(matchId: number) {
    const response = await this.client.put(`/api/matches/${matchId}/approve`);
    return response.data;
  }

  async rejectMatch(matchId: number) {
    await this.client.delete(`/api/matches/${matchId}`);
  }

  // Analytics endpoints
  async getDashboardStats() {
    const response = await this.client.get('/api/analytics/dashboard-stats');
    return response.data;
  }

  async getPerformanceMetrics() {
    const response = await this.client.get('/api/analytics/performance-metrics');
    return response.data;
  }

  async getRecentMatches(limit: number = 10) {
    const response = await this.client.get('/api/analytics/recent-matches', {
      params: { limit },
    });
    return response.data;
  }

  async getFinancialMetrics() {
    const response = await this.client.get('/api/analytics/financial-metrics');
    return response.data;
  }
}

export const api = new ApiClient();
