export const api_response = (
  data: any,
  status: number,
  message: string = null,
) => {
  return {
    data: data,
    message: message,
    status: status,
  };
};
