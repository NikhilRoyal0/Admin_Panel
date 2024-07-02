import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            sessionStorage.setItem("BranchId", userDetails.branchId);
            sessionStorage.setItem("discountLimit", userDetails.discountLimit);
            sessionStorage.setItem("api-token", API_TOKEN);
            const expiresIn = userDetails.expiryTimestamp;
            const expiryTimestamp = expiresIn * 1000;
            const now = Date.now();
            const timeUntilExpiry = expiryTimestamp - now;

            setTimeout(logout, timeUntilExpiry);

            return true;
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const checkTokenExpiry = () => {
    const authToken = sessionStorage.getItem("authToken");
    if (authToken) {
        try {
            const userDetails = getUserDetailsFromToken(authToken);
            if (!userDetails) {
                throw new Error("Error decoding token");
            }

            const expiryTimestamp = userDetails.expiryTimestamp * 1000;
            const now = Date.now();

            if (expiryTimestamp < now) {
                window.location.reload();
                logout();
            } else {
                setTimeout(checkTokenExpiry, expiryTimestamp - now);
            }
        } catch (error) {
            console.error("Error checking token expiry:", error);
        }
    }
};
checkTokenExpiry();

export const logout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("BranchId");
    sessionStorage.removeItem("discountLimit");
    sessionStorage.removeItem("api-token");
};

export function getUserDetailsFromToken(authToken) {
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
        const expiryTimestamp = payload.exp;

        return {
            userId: payload.userData.userId,
            status: payload.userData.status,
            role: payload.userData.roleAttribute[0].status,
            expiryTimestamp: expiryTimestamp,
            branchId: payload.userData.branchId,
            discountLimit: payload.userData.discountLimit,
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
