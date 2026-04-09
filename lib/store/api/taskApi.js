import { parseJson } from "@/lib/utils/parseResponse";

const taskApi = {
  async getTasks({ token }) {
    try {
      const response = await fetch("/api/task", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await parseJson(response);

      return {
        ...data,
        data: data?.data || [],
        success: response.ok,
      };
    } catch {
      return {
        success: false,
        status: 0,
        data: [],
        message: "Network error",
      };
    }
  },

  async createTask({ token, value }) {
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });
      const data = await parseJson(response);

      return {
        ...data,
        success: response.ok,
      };
    } catch {
      return {
        success: false,
        status: 0,
        message: "Network error",
      };
    }
  },

  async completeTask({ token, taskId }) {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await parseJson(response);

      return {
        ...data,
        success: response.ok,
      };
    } catch {
      return {
        success: false,
        status: 0,
        message: "Network error",
      };
    }
  },
};

export default taskApi;
