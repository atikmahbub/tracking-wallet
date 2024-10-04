import { AjaxError } from "@snickerdoodlelabs/objects";

interface IApiAjaxError extends AjaxError {
  src: {
    response: {
      data: IApiError;
    };
  };
}

interface IApiError<T = string> {
  code: number;
  message: T;
  name: string;
}

export const extractApiError = (_: AjaxError): IApiError => {
  const ajaxError = _ as IApiAjaxError;
  const apiError = ajaxError?.src?.response?.data as IApiError;
  return apiError;
};
