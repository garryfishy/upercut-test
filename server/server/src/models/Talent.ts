import mongoose, { Document } from "mongoose";
import { ICompany } from "./Company";

export interface ITalent extends Document {
  name: string;
  email: string;
  password: string;
  companies: ICompany[];
}

async function emailValidator(this: any, email: string) {
  if (!this || !this._id) {
    const existingTalent = await mongoose.models.Talent.findOne({ email });
    return !existingTalent;
  } else {
    return true;
  }
}

const talentSchema = new mongoose.Schema({
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
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
});
export const TalentModel = mongoose.model<ITalent>("Talent", talentSchema);
