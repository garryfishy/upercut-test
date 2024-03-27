export interface Company {
  _id: string;
  name: string;
  yearOfCreation: number;
  password: string;
  email: string;
  users: [Talent];
}

export interface Talent {
  _id: string;
  name: string;
  email: string;
  companies: [Company];
  password: string;
  companyIds: string[];
}
