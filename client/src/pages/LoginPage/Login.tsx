import React, { useState } from "react";
import "./styles.css";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/client";
import { Input } from "../../components/TextField";
import { LOGIN_COMPANY, LOGIN_TALENT } from "../../graphql/graphql";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [loginCompany] = useMutation(LOGIN_COMPANY);
  const [loginTalent] = useMutation(LOGIN_TALENT);
  const [type, setType] = useState<string>("Company");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { data } =
        type === "Company"
          ? await loginCompany({
              variables: {
                input: {
                  email,
                  password,
                },
              },
            })
          : await loginTalent({
              variables: {
                input: {
                  email,
                  password,
                },
              },
            });

      const token = data.companyLogin
        ? data.companyLogin.token
        : data.loginTalent.token;

      localStorage.setItem("token", token);
      console.log(data.companyLogin, "<< isi dat");
      localStorage.setItem(
        "id",
        data.companyLogin ? data.companyLogin._id : data.loginTalent._id
      );
      localStorage.setItem("role", data.companyLogin ? "company" : "talent");
      Swal.fire("Success");
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error",
        allowEnterKey: true,
        text: error as string,
      });
    }
  };

  const otherType = type === "Company" ? "Talent" : "Company";
  return (
    <main className="container">
      <section className="box">
        <section
          onClick={() => {
            if (type === "Company") {
              setType("Talent");
            } else {
              setType("Company");
            }
          }}
        >
          <p className="type-change">{otherType} login</p>
        </section>
        <h2 className="title">{type} Login</h2>
        <form onSubmit={handleLogin}>
          <section className="form-group">
            <Input
              required
              type="email"
              placeholder="Email"
              label="Email"
              name="email"
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
          <Button className="button" type="submit">
            Login
          </Button>
        </form>
        <footer>
          <p>Don't have an account ?</p>
          <nav>
            <a href="/register" className="href">
              Click here to register
            </a>
          </nav>
        </footer>
      </section>
    </main>
  );
}
