import axios, { AxiosRequestConfig } from "axios";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxResponse,
} from "@trackingPortal/api/utils/IAxiosAjaxUtils";

export class AxiosAjaxUtils implements IAxiosAjaxUtils {
  private accessToken: string | null = null;

  // Set access token
  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Helper to build headers, including the Authorization token
  private buildHeaders(headers?: object): object {
    const defaultHeaders: object = {
      "Content-Type": "application/json",
      ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
    };
    return { ...defaultHeaders, ...headers };
  }

  // Helper to create a custom response
  private createResponse<T>(data: T, status: number): IAxiosAjaxResponse<T> {
    return {
      isOk: () => status >= 200 && status < 300,
      value: data,
      error: null,
    };
  }

  // Helper to create an error response
  private createErrorResponse<T>(error: any): IAxiosAjaxResponse<T> {
    return {
      isOk: () => false,
      value: null,
      error,
    };
  }

  public async get<T>(
    url: URL,
    params?: object, // Added params as an optional parameter
    headers?: object
  ): Promise<IAxiosAjaxResponse<T>> {
    const config: AxiosRequestConfig = {
      headers: this.buildHeaders(headers),
      params, // Add params to the Axios request config
    };
    try {
      const response = await axios.get<T>(url.toString(), config);
      return this.createResponse(response.data, response.status);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  // POST request
  public async post<T>(
    url: URL,
    data: object,
    headers?: object
  ): Promise<IAxiosAjaxResponse<T>> {
    const config: AxiosRequestConfig = {
      headers: this.buildHeaders(headers),
    };
    try {
      const response = await axios.post<T>(url.toString(), data, config);
      return this.createResponse(response.data, response.status);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  // PUT request
  public async put<T>(
    url: URL,
    data: object,
    headers?: object
  ): Promise<IAxiosAjaxResponse<T>> {
    const config: AxiosRequestConfig = {
      headers: this.buildHeaders(headers),
    };
    try {
      const response = await axios.put<T>(url.toString(), data, config);
      return this.createResponse(response.data, response.status);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  // DELETE request
  public async delete<T>(
    url: URL,
    headers?: object
  ): Promise<IAxiosAjaxResponse<T>> {
    const config: AxiosRequestConfig = {
      headers: this.buildHeaders(headers),
    };
    try {
      const response = await axios.delete<T>(url.toString(), config);
      return this.createResponse(response.data, response.status);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }
}
