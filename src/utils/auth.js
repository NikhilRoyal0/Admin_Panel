import axios from "axios";

// Import the API_TOKEN from your environment or wherever it's defined
const API_TOKEN = "123";

export const isAuthenticated = () => {
    const authToken = sessionStorage.getItem("authToken");
    return authToken !== null;
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            import.meta.env.VITE_BASE_URL + "users/login",
            { email, password },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-token": API_TOKEN, // Manually set the api-token header
                },
            }
        );

        const { authToken } = response.data.data;

        if (authToken) {
            const userId = getUserIdFromToken(authToken);
            sessionStorage.setItem("authToken", authToken);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("api-token", API_TOKEN);
            return true;
        } else {
            console.error("Token verification failed");
            return false;
        }

    } catch (error) {
        console.error("Login Error:", error);
        return false;
    }
};

export const logout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
};

export const getUserIdFromToken = (authToken) => {
    if (!authToken) return null;

    try {
        const tokenParts = authToken.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.userData.userId;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
