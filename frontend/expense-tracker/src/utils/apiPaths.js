export const BASE_URL = import.meta.env.VITE_API_URL;

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER: "/api/v1/auth/getUser",
        UPDATE: "/api/v1/auth/update",
        FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
        RESET_PASSWORD: "/api/v1/auth/reset-password",
        VERIFY_EMAIL: "/api/v1/auth/verify-email",
    },
    EXPENSE: {
        ADD: "/api/v1/expense/add",
        LIST: "/api/v1/expense/list",
        DELETE: "/api/v1/expense/delete",
        UPDATE: "/api/v1/expense/update",
    },
    INCOME: {
        ADD: "/api/v1/income/add",
        LIST: "/api/v1/income/list",
        DELETE: "/api/v1/income/delete",
        UPDATE: "/api/v1/income/update",
    },
};
        
