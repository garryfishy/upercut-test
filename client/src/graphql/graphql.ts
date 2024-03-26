// mutations.js
import { gql } from "@apollo/client";

export const LOGIN_COMPANY = gql`
  mutation LoginCompany($input: LoginCompanyInput!) {
    companyLogin(input: $input) {
      _id
      token
    }
  }
`;

export const LOGIN_TALENT = gql`
  mutation loginTalent($input: LoginTalentInput!) {
    loginTalent(input: $input) {
      _id
      token
    }
  }
`;

export const GET_COMPANIES = gql`
  query GetAllCompanies($searchParams: CompanyInput) {
    getAllCompanies(searchParams: $searchParams) {
      _id
      name
      yearOfCreation
      email
    }
  }
`;

export const GET_TALENTS = gql`
  query GetAllTalents($searchParams: TalentInput) {
    getAllTalents(searchParams: $searchParams) {
      _id
      name
      email
      companies {
        _id
        email
        name
      }
    }
  }
`;

export const REGISTER_COMPANY = gql`
  mutation CreateCompany($input: CompanyInput!) {
    createCompany(input: $input) {
      name
      yearOfCreation
    }
  }
`;

export const REGISTER_TALENT = gql`
  mutation CreateTalent($input: TalentInput!) {
    createTalent(input: $input) {
      _id
      name
      email
    }
  }
`;

export const GET_COMPANY_INFOS = gql`
  query getCompanyInfos($companyId: ID!) {
    getCompanyInfos(companyId: $companyId) {
      _id
      name
      users {
        _id
        email
        name
      }
    }
  }
`;

export const GET_TALENT_INFOS = gql`
  query getTalentInfos($talentId: ID!) {
    getTalentInfos(talentId: $talentId) {
      _id
      name
      email
      companies {
        _id
        name
        email
        yearOfCreation
      }
    }
  }
`;

export const ADD_TALENT = gql`
  mutation AddTalent($talentId: ID!) {
    addTalent(talentId: $talentId) {
      name
    }
  }
`;

export const ADD_COMPANY = gql`
  mutation AddCompany($companyId: ID!) {
    addCompany(companyId: $companyId) {
      name
    }
  }
`;

export const DELETE_TALENT = gql`
  mutation DeleteTalents($talentIds: [ID]!) {
    deleteTalents(talentIds: $talentIds) {
      name
      email
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($companyIds: [ID]) {
    deleteCompanies(companyIds: $companyIds) {
      name
    }
  }
`;
