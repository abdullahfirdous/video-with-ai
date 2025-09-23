import { IVideo } from "@/models/Video"

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}; 

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/video");
  }

  async getVideo(id: string) {
    return this.fetch<IVideo>(`/video/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch("/video", {
      method: "POST",
      body: videoData,
    });
  }

  async deleteVideo(id: string) {
    return this.fetch(`/video/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();