import { useEffect } from "react";
import { CompanyHome } from "../../components/Home/CompanyHome";
import { TalentHome } from "../../components/Home/TalentHome";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/decode";
import Swal from "sweetalert2";
export function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      navigate("/login");
      Swal.fire({
        text: "Please login or register first.",
      });
    }
  }, [navigate]);
  if (localStorage.role === "company") {
    return <CompanyHome />;
  } else {
    return <TalentHome />;
  }
}
