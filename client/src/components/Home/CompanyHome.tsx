import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_TALENT,
  GET_COMPANY_INFOS,
  GET_TALENTS,
} from "../../graphql/graphql";
import { ChangeEvent, useEffect, useState } from "react";
import { CardComponent } from "../Card/Card";
import "./styles.css";
import { User } from "../../typings";
import { Input } from "../TextField";
import { Autocomplete, Button, SvgIcon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export function CompanyHome() {
  const [searchParams, setSearchParams] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTalents] = useMutation(DELETE_TALENT, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
  });

  const handleCheckboxCheck = (id: string) => {
    setSelectedIds((prevIds) => [...prevIds, id]);
  };

  const handleCheckboxUncheck = (id: string) => {
    setSelectedIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
  };

  const navigate = useNavigate();

  const {
    data,
    loading,
    refetch: refetchProfile,
  } = useQuery(GET_COMPANY_INFOS, {
    variables: {
      companyId: localStorage.getItem("id"),
    },
  });

  const { data: companies, refetch } = useQuery(GET_TALENTS, {
    variables: {
      searchParams: {
        name: searchParams,
      },
    },
  });

  const handleProfileRefetch = () => {
    refetchProfile();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDelete = async () => {
    try {
      const { data } = await deleteTalents({
        variables: {
          talentIds: selectedIds,
        },
      });
      if (data) {
        Swal.fire({
          icon: "success",
          text: "Delete successful",
        });
        setSelectedIds([]);
        refetchProfile();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Error: " + error,
      });
    }
  };

  useEffect(() => {
    refetchProfile();
  }, [searchParams, refetch, refetchProfile]);

  if (loading) return <section>loading</section>;
  return (
    <main className="box">
      <section>
        <Button onClick={handleLogout}>Logout</Button>
      </section>
      <h1 className="title">{data?.getCompanyInfos?.name} Dashboard</h1>
      <section>
        <p className="title">Your User List</p>
      </section>
      <section className="card-container">
        {data?.getCompanyInfos?.users?.length > 0 ? (
          <>
            {data?.getCompanyInfos?.users?.map((user: User) => {
              return (
                <CardComponent
                  key={user._id}
                  name={user.name}
                  email={user.email}
                  canDelete
                  id={user._id}
                  onCheck={handleCheckboxCheck}
                  onUncheck={handleCheckboxUncheck}
                />
              );
            })}
          </>
        ) : (
          <h2>No users yet in this company</h2>
        )}
      </section>
      {selectedIds.length > 0 && (
        <section onClick={handleDelete}>
          <SvgIcon
            onClick={handleDelete}
            sx={{
              cursor: "pointer",
              fontSize: "24px",
              color: "#757575",
              transition: "color 0.3s ease",
              "&:hover path": {
                fill: "#f44336",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
            </svg>
          </SvgIcon>
        </section>
      )}
      <p className="title">
        Showing {data?.getCompanyInfos?.users?.length} result
      </p>
      <section>
        <h2 className="title">Search for other companies</h2>
        <section className="input">
          <Autocomplete
            options={companies?.getAllTalents || []}
            getOptionLabel={(option: User) => option?.name}
            renderInput={(params) => {
              return (
                <>
                  <Input
                    {...params}
                    label="Search for other talents"
                    variant="outlined"
                    onChange={(e) => setSearchParams(e.target.value)}
                    onSelect={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchParams(e.target.value)
                    }
                  />
                </>
              );
            }}
          />
        </section>
        <section className="card-container">
          {companies?.getAllTalents?.length > 0 ? (
            <>
              {companies?.getAllTalents.map((user: User) => {
                return (
                  <CardComponent
                    key={user._id}
                    name={user.name}
                    email={user.email}
                    id={user._id}
                    canAdd
                    refetchProfile={handleProfileRefetch}
                  />
                );
              })}
            </>
          ) : (
            <h2>No users yet in this company</h2>
          )}
        </section>
      </section>
    </main>
  );
}
