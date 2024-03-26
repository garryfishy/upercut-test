import { Select, MenuItem, Button, InputLabel } from "@mui/material";
import { Input } from "../../components/TextField";
import { useEffect, useState } from "react";
import "./styles.css";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_COMPANIES,
  REGISTER_COMPANY,
  REGISTER_TALENT,
} from "../../graphql/graphql";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { User } from "../../typings";

export function Register() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [registerType, setRegisterType] = useState("Company");
  const { data } = useQuery(GET_COMPANIES);
  const [createCompany] = useMutation(REGISTER_COMPANY);
  const [createTalent] = useMutation(REGISTER_TALENT);

  const handleSelectChange = (event: { target: { value: string } }) => {
    setSelectedCompany(event.target.value);
  };

  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const register =
        registerType === "Company"
          ? await createCompany({
              variables: {
                input: {
                  email,
                  password,
                  yearOfCreation: parseInt(
                    formData.get("yearOfCreation") as string
                  ),
                  name,
                },
              },
            })
          : await createTalent({
              variables: {
                input: {
                  email,
                  password,
                  name,
                  companyIds: [selectedCompany],
                },
              },
            });
      if (register) {
        console.log(register, "<< ini regis");
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You can start logging in now.",
        });
        navigate("/login");
      }
    } catch (error) {
      Swal.fire("Error: " + error);
    }
  };

  useEffect(() => {}, [registerType, selectedCompany]);
  return (
    <section className="container">
      <section className="box">
        <p>Register an Account</p>
        <form onSubmit={handleRegister}>
          <section className="form-group">
            <InputLabel id="select-type-label" sx={{ color: "whitesmoke" }}>
              Select type
            </InputLabel>
            <Select
              value={registerType}
              onChange={(e) => setRegisterType(e.target.value)}
              labelId="select-type-label"
              sx={{
                backgroundColor: "whitesmoke",
                borderRadius: "0.5rem",
              }}
            >
              <MenuItem value="Company">Company</MenuItem>
              <MenuItem value="Talent">Talent</MenuItem>
            </Select>
          </section>
          <section className="form-group">
            <Input
              required
              type="email"
              placeholder="Email"
              label="Email"
              name="email"
              // onChange={(e) => setEmail(e.target.value)}
            />
          </section>
          <section className="form-group">
            <Input
              required
              type="name"
              placeholder={`${registerType} Name`}
              label={`${registerType} Name`}
              name="name"
            />
          </section>
          <section className="form-group">
            <Input
              required
              type="password"
              placeholder="Password"
              label="Password"
              name="password"
            />
          </section>
          {registerType === "Company" ? (
            <section className="form-group">
              <Input
                required
                type="number"
                placeholder="Year Of Creation"
                label="Year Of Creation"
                name="yearOfCreation"
              />
            </section>
          ) : (
            <section className="form-group">
              <InputLabel id="select-type-label" sx={{ color: "whitesmoke" }}>
                Select Company
              </InputLabel>
              <Select
                value={selectedCompany}
                onChange={handleSelectChange}
                placeholder="Select a company"
                sx={{
                  backgroundColor: "whitesmoke",
                  borderRadius: "0.5rem",
                }}
              >
                {data?.getAllCompanies.map((e: User) => (
                  <MenuItem key={e._id} value={e._id}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </section>
          )}
          <Button className="button" type="submit">
            Register
          </Button>
        </form>
        <footer>
          <p>Already have an account ?</p>
          <nav>
            <a href="/login" className="href">
              Login
            </a>
          </nav>
        </footer>
      </section>
    </section>
  );
}
