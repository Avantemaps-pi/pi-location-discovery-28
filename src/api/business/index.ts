
interface BusinessResponse {
  success: boolean;
  message?: string;
}

export const createBusiness = async (values: any): Promise<BusinessResponse> => {
  // TODO: Implement business creation logic
  return { success: true };
};

export const updateBusiness = async (id: number, values: any): Promise<BusinessResponse> => {
  // TODO: Implement business update logic
  return { success: true };
};

