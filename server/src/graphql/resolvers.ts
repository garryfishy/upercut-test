import { CompanyModel } from "../models/Company";
import { TalentModel } from "../models/Talent";
import BcryptHelper from "../helpers/bcrypt";
import JwtHelper, { UserRole } from "../helpers/jwthelper";
import mongoose from "mongoose";
export const resolvers = {
  Query: {
    getCompanyInfos: async (
      _: unknown,
      { companyId }: { companyId: string }
    ) => {
      try {
        const company = await CompanyModel.findOne({ _id: companyId }).populate(
          "users"
        );
        if (!company) {
          throw new Error("company not found.");
        }

        return company;
      } catch (error) {
        throw new Error("Failed to fetch company information: " + error);
      }
    },
    getTalentInfos: async (_: unknown, { talentId }: { talentId: string }) => {
      try {
        const talent = await TalentModel.findOne({ _id: talentId }).populate(
          "companies"
        );

        if (!talent) {
          throw new Error("Talent not found.");
        }

        return talent;
      } catch (error) {
        throw new Error(`Error getting talent info: ${error}`);
      }
    },
    getAllCompanies: async (
      _: unknown,
      { searchParams }: { searchParams: any }
    ) => {
      try {
        let query: Record<string, any> = {};

        if (searchParams) {
          query = Object.keys(searchParams).reduce((acc, key) => {
            acc[key] = { $regex: new RegExp(searchParams[key], "i") };
            return acc;
          }, {} as Record<string, any>);
        }

        const companiesWithTalents = await CompanyModel.find(query);
        return companiesWithTalents;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch companies with talents.");
      }
    },
    getAllTalents: async (
      _: unknown,
      { searchParams }: { searchParams: any }
    ) => {
      try {
        let query: Record<string, any> = {};

        if (searchParams) {
          query = Object.keys(searchParams).reduce((acc, key) => {
            acc[key] = { $regex: new RegExp(searchParams[key], "i") };
            return acc;
          }, {} as Record<string, any>);
        }

        const companiesWithTalents = await TalentModel.find(query);
        return companiesWithTalents;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    createCompany: async (_: unknown, { input }: { input: any }) => {
      try {
        const hashedPassword = await BcryptHelper.hashPassword(input.password);
        const inputWithHashedPassword = { ...input, password: hashedPassword };

        const company = await CompanyModel.create(inputWithHashedPassword);
        return company;
      } catch (error) {
        throw new Error("Failed to create company: " + error);
      }
    },

    companyLogin: async (_: unknown, { input }: { input: any }) => {
      try {
        const { email, password } = input;

        const company = await CompanyModel.findOne({ email });

        if (!company) {
          throw new Error("Company not found.");
        }

        const passwordMatch = await BcryptHelper.comparePassword(
          password,
          company.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid password.");
        }

        const token = JwtHelper.generateToken({
          companyId: company._id,
          role: UserRole.COMPANY,
        });

        return { _id: company._id, token };
      } catch (error) {
        throw new Error(`Error logging in company: ${error}`);
      }
    },
    addTalent: async (
      _: unknown,
      { talentId }: { talentId: string },
      context: any
    ) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await JwtHelper.authorizeCompany(context.headers.authorization);

        const { companyId } = JwtHelper.verifyToken(
          context.headers.authorization
        );

        const existingCompany = await CompanyModel.findOne({
          _id: companyId,
          users: talentId,
        }).session(session);

        if (existingCompany) {
          throw new Error("Talent is already associated with this company.");
        }

        const updatedTalent = await TalentModel.findByIdAndUpdate(
          talentId,
          { $addToSet: { companies: companyId } },
          { new: true, session }
        );

        const updatedCompany = await CompanyModel.findByIdAndUpdate(
          companyId,
          { $addToSet: { users: talentId } },
          { new: true, session }
        );

        if (!updatedTalent || !updatedCompany) {
          throw new Error("Failed to update talent or company.");
        }

        await session.commitTransaction();

        return updatedTalent;
      } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted:", error);
        throw new Error("Failed to add talent to company: " + error);
      } finally {
        session.endSession();
      }
    },

    deleteTalents: async (
      _: unknown,
      { talentIds }: { talentIds: string[] },
      context: any
    ) => {
      const { companyId } = await JwtHelper.verifyToken(
        context.headers.authorization
      );

      try {
        const updatedCompany = await (
          await mongoose.startSession()
        ).withTransaction(async (session) => {
          const updatePromises = talentIds.map(async (talentId) => {
            const talent = await TalentModel.findById(talentId).session(
              session
            );
            if (talent) {
              talent.companies = talent.companies.filter(
                (company) => company.toString() !== companyId
              );
              await talent.save();
            }
          });
          await Promise.all(updatePromises);

          return await CompanyModel.findByIdAndUpdate(
            companyId,
            { $pullAll: { users: talentIds } },
            { new: true, session }
          );
        });

        return updatedCompany;
      } catch (error) {
        console.error("Transaction aborted:", error);
        throw new Error("Failed to delete talents from company: " + error);
      }
    },

    // // Mutations for Talent actions
    createTalent: async (
      _: unknown,
      { input }: { input: any },
      context: any
    ) => {
      try {
        const { name, email, password, companyIds } = input;

        const companies = await CompanyModel.find({ _id: { $in: companyIds } });
        if (companies.length !== companyIds.length) {
          throw new Error("One or more companies not found.");
        }

        const newTalent = new TalentModel({
          name,
          email,
          password: await BcryptHelper.hashPassword(password),
          companies: companyIds,
        });
        await newTalent.save();

        for (const company of companies) {
          company.users.push(newTalent._id);
          await company.save();
        }

        return newTalent;
      } catch (error) {
        throw new Error(`Error creating talent: ${error}`);
      }
    },

    loginTalent: async (_: unknown, { input }: { input: any }) => {
      try {
        const { email, password } = input;

        const talent = await TalentModel.findOne({ email });

        if (!talent) {
          throw new Error("Talent not found.");
        }

        const passwordMatch = await BcryptHelper.comparePassword(
          password,
          talent.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid password.");
        }

        const token = JwtHelper.generateToken({
          talentId: talent._id,
          role: UserRole.USER,
        });

        return { _id: talent._id, token };
      } catch (error) {
        throw new Error(`Error logging in talent: ${error}`);
      }
    },

    addCompany: async (
      _: unknown,
      { companyId }: { companyId: string },
      context: any
    ) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await JwtHelper.authorizeUser(context.headers.authorization);

        const { talentId } = JwtHelper.verifyToken(
          context.headers.authorization
        );

        const updatedTalent = await TalentModel.findOneAndUpdate(
          { _id: talentId },
          { $addToSet: { companies: companyId } },
          { new: true, session }
        );

        const updatedCompany = await CompanyModel.findByIdAndUpdate(
          companyId,
          { $addToSet: { users: talentId } },
          { new: true, session }
        );

        if (!updatedTalent || !updatedCompany) {
          throw new Error("Failed to update talent or company.");
        }

        await session.commitTransaction();

        return updatedTalent;
      } catch (error) {
        await session.abortTransaction();
        console.error("Transaction aborted:", error);
        throw new Error("Failed to add company to talent: " + error);
      } finally {
        session.endSession();
      }
    },

    deleteCompanies: async (
      _: unknown,
      { companyIds }: { companyIds: string[] },
      context: any
    ) => {
      const { talentId } = await JwtHelper.verifyToken(
        context.headers.authorization
      );

      try {
        const deletedCompanies = await (
          await mongoose.startSession()
        ).withTransaction(async (session) => {
          const companies = await CompanyModel.find({
            _id: { $in: companyIds },
          }).session(session);

          const updatePromises = companies.map(async (company) => {
            company.users = company.users.filter(
              (userId) => userId.toString() !== talentId
            );
            await company.save();
          });
          await Promise.all(updatePromises);

          const talent = await TalentModel.findById(talentId).session(session);
          if (talent) {
            talent.companies = talent.companies.filter(
              (companyId) => !companyIds.includes(companyId.toString())
            );
            await talent.save();
          }

          return companies;
        });

        return deletedCompanies;
      } catch (error) {
        console.error("Transaction aborted:", error);
        throw new Error("Failed to delete companies: " + error);
      }
    },
  },
};
