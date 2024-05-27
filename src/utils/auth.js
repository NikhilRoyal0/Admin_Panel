import axios from "axios";

const API_TOKEN = "123";

export const isAuthenticated = () => {
    const authToken = sessionStorage.getItem("authToken");
    return authToken !== null;
};

export const login = async (email, password) => {
        const response = await axios.post(
            import.meta.env.VITE_BASE_URL + "users/login",
            { email, password },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-token": API_TOKEN,
                },
            }
        );

        const { authToken } = response.data.data;

        if (authToken) {
            const userDetails = getUserDetailsFromToken(authToken);

            if (!userDetails) {
                throw new Error("Error decoding token");
            }

            if (userDetails.status === "Inactive") {
                throw new Error("User is no longer available");
            }

            if (userDetails.role === "Inactive") {
                throw new Error("Role is no longer available for user");
            }

            sessionStorage.setItem("authToken", authToken);
            sessionStorage.setItem("userId", userDetails.userId);
            sessionStorage.setItem("api-token", API_TOKEN);
            return true;
        } else {
            throw new Error("Invalid credentials");
        }

};

export const logout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("api-token");
};

export const getUserDetailsFromToken = (authToken) => {
    if (!authToken) {
        console.error("No authToken provided");
        return null;
    }

    try {
        const tokenParts = authToken.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const payload = JSON.parse(atob(tokenParts[1]));

        return {
            userId: payload.userData.userId,
            status: payload.userData.status,
            role: payload.userData.roleAttribute[0].status,
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
