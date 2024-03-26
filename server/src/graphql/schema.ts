export const typeDefs = `
  type Company {
    _id: ID
    name: String
    yearOfCreation: Int
    email: String
    users: [Talent]
  }

  type Talent {
    _id: ID
    name: String
    email: String
    companies: [Company]
  }

  type AuthPayload {
    _id: ID
    token: String
  }

  input CompanyInput {
    name: String
    password: String
    email: String
    yearOfCreation: Int
  }

  input LoginCompanyInput{
    email: String!
    password: String!
  }

  input TalentInput {
    name: String
    email: String
    password: String
    companyIds: [ID!]
  }

  input LoginTalentInput {
    email: String!
    password: String!
  }

  type Query {
    getCompanyInfos(companyId: ID!): Company
    getAllCompanies(searchParams: CompanyInput): [Company]
    getTalentInfos(talentId: ID!): Talent
    getAllTalents(searchParams: TalentInput): [Talent]
  }

  type Mutation {
    createCompany(input: CompanyInput): Company
    companyLogin(input: LoginCompanyInput): AuthPayload
    addTalent(talentId: ID): Company
    deleteTalents(talentIds: [ID]): Company

    createTalent(input: TalentInput): Talent
    loginTalent(input: LoginTalentInput): AuthPayload
    addCompany(companyId: ID): Talent
    deleteCompanies(companyIds: [ID]): Talent
  }
`;
