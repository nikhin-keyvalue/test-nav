export type DealersResponse = Array<{
  id: number;
  name: string;
  address?: string;
  email?: string;
  houseNumber?: string;
  phone?: string;
  zipCode?: string;
}>;

export type Salesperson = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  login: string;
};

export type SalespersonListResponse = Array<Salesperson>;
