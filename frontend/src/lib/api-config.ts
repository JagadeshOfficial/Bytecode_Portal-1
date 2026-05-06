/**
 * API Configuration for Bytecode Trainings Platform
 */

const IS_SERVER = typeof window === 'undefined';

// Use environment variables if available, otherwise fallback to localhost for development
export const API_URLS = {
    // LMS Node Backend (Default: 8080)
    LMS_BACKEND: process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8080',
    
    // Master Backend (Default: 8085)
    MASTER_BACKEND: process.env.NEXT_PUBLIC_MASTER_API_URL || 'http://localhost:8085',
    
    // B-EMS Backend (Default: 5001)
    B_EMS_BACKEND: process.env.NEXT_PUBLIC_BEMS_API_URL || 'http://localhost:5001',
};

export default API_URLS;
