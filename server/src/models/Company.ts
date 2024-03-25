import mongoose, { Schema, Document } from "mongoose";
import { ITalent } from "./Talent";

export interface ICompany extends Document {
  name: string;
  password: string;
  email: string;
  yearOfCreation: number;
  users: ITalent[];
}

async function emailValidator(this: any, email: string) {
  if (!this || !this._id) {
    const existingCompany = await mongoose.models.Company.findOne({ email });
    return !existingCompany;
  } else {
    return true;
  }
}

const companySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: emailValidator,
      message: "Email already exists.",
    },
  },
  password: { type: String, required: true },
  yearOfCreation: { type: Number, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "Talent" }],
});

export const CompanyModel = mongoose.model<ICompany>("Company", companySchema);
