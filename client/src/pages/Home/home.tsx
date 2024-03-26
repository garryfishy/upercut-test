import { CompanyHome } from "../../components/Home/CompanyHome";
import { TalentHome } from "../../components/Home/TalentHome";
export function Home() {
  if (localStorage.role === "company") {
    return <CompanyHome />;
  } else {
    return <TalentHome />;
  }
}
