import axios from "axios";

// export const imageBaseUrl = "https://mweapi.nwtdemos.com/";
export const imageBaseUrl = "http://127.0.0.1:8000/";
// export const imageBaseUrl = "http://rmis.mwe.go.ug/api/";

// const baseURL = "https://mweapi.nwtdemos.com/api/";
const baseURL = "http://127.0.0.1:8000/api";
// const baseURL = "http://rmis.mwe.go.ug/api/";
const accessToken = localStorage.getItem("access_token");

const axiosAPI = axios.create({
    baseURL: baseURL,
    // withCredentials: false,
    //timeout: 10000,
    timeout: 50000,
    headers: {
        Authorization: accessToken ? "Bearer " + accessToken : null,
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

axiosAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.status === 401 && originalRequest.url === baseURL + "token/refresh/") {
            window.location.href = "/login/";
            return Promise.reject(error);
        }
        console.log(error);
        if (error.status === 401 && error.response.statusText === "Unauthorized") {
            const refresh = localStorage.getItem("refresh_token");

            if (refresh) {
                const tokenParts = JSON.parse(atob(refresh.split(".")[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {
                    try {
                        const response = await axiosAPI.post("/token/refresh/", {
                            refresh,
                        });
                        setNewHeaders(response);
                        originalRequest.headers["Authorization"] = "JWT " + response.data.access;
                        return axiosAPI(originalRequest);
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    console.log("Refresh token is expired", tokenParts.exp, now);
                    window.location.href = "/login/";
                }
            } else {
                console.log("Refresh token not available.");
                window.location.href = "/login/";
            }
        }

        // specific error handling done elsewhere
        return Promise.reject(error);
    }
);

export function setNewHeaders(response) {
    axiosAPI.defaults.headers["Authorization"] = "Bearer " + response.data.access;
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.access_token);
}

export function setProfileHeaders(response) {
    localStorage.setItem("profile", JSON.stringify(response.data));
}

export default axiosAPI;
