import { parseJson } from "@/lib/utils/parseResponse";

const authApi = {
  async signIn({ login, password }) {
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await parseJson(response);

      return {
        ...data,
        success: response.ok,
        status: response.status,
      };
    } catch {
      return {
        success: false,
        status: 0,
        message: "Network error",
      };
    }
  },

  async signUp({ login, password }) {
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await parseJson(response);

      return {
        ...data,
        success: response.ok,
        status: response.status,
      };
    } catch {
      return {
        success: false,
        status: 0,
        message: "Network error",
      };
    }
  },

  async checkExisting({ login }) {
    try {
      const params = new URLSearchParams();
      params.append("login", login);
      const response = await fetch(`/api/auth/check?${params}`);
      const data = await parseJson(response);

      return {
        ...data,
        success: response.ok && Boolean(data?.success),
        status: response.status,
      };
    } catch {
      return {
        success: false,
        status: 0,
      };
    }
  },
};

export default authApi;
