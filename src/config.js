export const API_BASE_URL = 'https://knowledge-capture.onrender.com';

export const ENDPOINTS = {
    UPLOAD: `${API_BASE_URL}/files/upload`,
    LIST_FILES: `${API_BASE_URL}/files/list`,
    DELETE_FILE: (id) => `${API_BASE_URL}/files/${id}`,
    CHAT: `${API_BASE_URL}/chat/query`,
};
