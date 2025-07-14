// API configuration and service functions
const API_BASE_URL = 'http://localhost:5000/api';

// API service class for making HTTP requests
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If response is not JSON, keep the default message
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API service instance
const apiService = new ApiService();

// Doctor-related API calls
export const doctorsApi = {
  // Get all doctors with optional filters
  getAll: (params?: {
    specialty?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    return apiService.get<ApiResponse<Doctor[]>>(
      `/doctors${queryString ? `?${queryString}` : ''}`
    );
  },

  // Get single doctor by ID
  getById: (id: string) => 
    apiService.get<ApiResponse<Doctor>>(`/doctors/${id}`),

  // Get doctors by specialty
  getBySpecialty: (specialty: string) =>
    apiService.get<ApiResponse<Doctor[]>>(`/doctors?specialty=${specialty}`),
};

// Services-related API calls
export const servicesApi = {
  // Get all services with optional filters
  getAll: (params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    return apiService.get<ApiResponse<Service[]>>(
      `/services${queryString ? `?${queryString}` : ''}`
    );
  },

  // Get single service by ID
  getById: (id: string) => 
    apiService.get<ApiResponse<Service>>(`/services/${id}`),

  // Get services by category
  getByCategory: (category: string) =>
    apiService.get<ApiResponse<Service[]>>(`/services?category=${category}`),
};

// Appointments-related API calls
export const appointmentsApi = {
  // Get all appointments
  getAll: () => 
    apiService.get<ApiResponse<Appointment[]>>('/appointments'),

  // Get appointment by ID
  getById: (id: string) => 
    apiService.get<ApiResponse<Appointment>>(`/appointments/${id}`),

  // Create new appointment
  create: (appointmentData: CreateAppointmentData) =>
    apiService.post<ApiResponse<Appointment>>('/appointments', appointmentData),

  // Update appointment
  update: (id: string, appointmentData: Partial<Appointment>) =>
    apiService.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointmentData),

  // Cancel appointment
  cancel: (id: string) =>
    apiService.delete<ApiResponse<void>>(`/appointments/${id}`),
};

// Users-related API calls
export const usersApi = {
  // Get all users
  getAll: () => 
    apiService.get<ApiResponse<User[]>>('/users'),

  // Get user by ID
  getById: (id: string) => 
    apiService.get<ApiResponse<User>>(`/users/${id}`),

  // Get patients
  getPatients: () =>
    apiService.get<ApiResponse<User[]>>('/users?role=patient'),
};

// Auth API endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiService.post<{
      success: boolean;
      message: string;
      data: {
        user: User;
        doctorProfile?: Doctor;
        token: string;
      };
    }>('/auth/login', credentials);
  },

  register: async (userData: any) => {
    return apiService.post<{
      success: boolean;
      message: string;
      data: {
        user: User;
        token: string;
      };
    }>('/auth/register', userData);
  },

  me: async () => {
    return apiService.get<{
      success: boolean;
      data: {
        user: User;
        doctorProfile?: Doctor;
      };
    }>('/auth/me');
  },

  logout: async () => {
    return apiService.post<{
      success: boolean;
      message: string;
    }>('/auth/logout', {});
  },

  updatePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    return apiService.put<{
      success: boolean;
      message: string;
    }>('/auth/updatepassword', passwords);
  },

  forgotPassword: async (email: string) => {
    return apiService.post<{
      success: boolean;
      message: string;
    }>('/auth/forgotpassword', { email });
  }
};

// Health check
export const healthApi = {
  check: () => apiService.get<ApiResponse<any>>('/health'),
};

// Admin API endpoints
export const adminApi = {
  // User Management
  getAllUsers: (params?: {
    role?: 'patient' | 'doctor' | 'admin';
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return apiService.get<ApiResponse<User[]>>(
      `/admin/users${queryString ? `?${queryString}` : ''}`
    );
  },

  // Update user status
  updateUserStatus: (userId: string, isActive: boolean) =>
    apiService.put<ApiResponse<User>>(`/admin/users/${userId}/status`, { isActive }),

  // Delete user
  deleteUser: (userId: string) =>
    apiService.delete<ApiResponse<void>>(`/admin/users/${userId}`),

  // Doctor Management
  getAllDoctors: (params?: {
    status?: 'active' | 'inactive' | 'suspended' | 'pending_verification';
    specialty?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    return apiService.get<ApiResponse<Doctor>>(
      `/admin/doctors${queryString ? `?${queryString}` : ''}`
    );
  },

  // Verify doctor
  verifyDoctor: (doctorId: string) =>
    apiService.put<ApiResponse<Doctor>>(`/admin/doctors/${doctorId}/verify`, {}),

  // Update doctor status
  updateDoctorStatus: (doctorId: string, status: 'active' | 'inactive' | 'suspended' | 'pending_verification') =>
    apiService.put<ApiResponse<Doctor>>(`/admin/doctors/${doctorId}/status`, { status }),

  // System Analytics
  getSystemStats: () =>
    apiService.get<{
      success: boolean;
      data: {
        totalUsers: number;
        totalDoctors: number;
        totalPatients: number;
        totalAppointments: number;
        todaysAppointments: number;
        pendingDoctors: number;
        systemHealth: {
          database: boolean;
          api: boolean;
          backup: boolean;
        };
      };
    }>('/admin/stats'),

  // Appointment Management
  getAllAppointments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
    date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.date) queryParams.append('date', params.date);
    
    const queryString = queryParams.toString();
    return apiService.get<ApiResponse<Appointment[]>>(
      `/admin/appointments${queryString ? `?${queryString}` : ''}`
    );
  },

  // System Reports
  generateReport: (type: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string) =>
    apiService.post<{
      success: boolean;
      data: {
        reportId: string;
        downloadUrl: string;
      };
    }>('/admin/reports', { type, startDate, endDate }),
};

// Export API service instance
export default apiService;

// Type definitions
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalDoctors?: number;
    totalServices?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'doctor' | 'patient' | 'admin';
  profileImage?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  _id: string;
  user: User;
  licenseNumber: string;
  specialties: string[];
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: number;
  }>;
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate: Date;
  }>;
  experience: {
    years: number;
    description: string;
  };
  consultationFee: number;
  languages: string[];
  bio: string;
  rating: {
    average: number;
    count: number;
  };
  totalPatients: number;
  isAvailableForEmergency: boolean;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  workingHours: {
    [key: string]: {
      isWorking: boolean;
      startTime: string;
      endTime: string;
    };
  };
  // Virtual fields
  primarySpecialty?: string;
  experienceLevel?: string;
  ratingDisplay?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  category: string;
  features: string[];
  availability: string;
  pricing: {
    consultationFee: {
      min: number;
      max: number;
      average: number;
      currency: string;
    };
  };
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  // Virtual fields
  priceRangeDisplay?: string;
  ratingDisplay?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id: string;
  patient: string | User;
  doctor: string | Doctor;
  service?: string | Service;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  consultationFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentData {
  doctor: string;
  service?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
}
