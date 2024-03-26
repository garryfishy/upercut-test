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
    console.log(selectedIds);
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
          <p className="title">
            <SvgIcon
              onClick={() => {
                handleDelete();
              }}
              sx={{
                cursor: "pointer",
                fontSize: "24px",
                color: "#757575",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "#f44336",
                },
              }}
            >
              <path
                fill="currentColor"
                d="M14.5 3h-5l-1-1h-3l-1 1h-1v1h1l1 12c0 .6.4 1 1 1h10c.6 0 1-.4 1-1l1-12h1v-1h-1zM7 3.5l.5-.5h6l.5.5h-7zM17 16c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-1h7v1zM12 5h-2v8h2v-8z"
              />
            </SvgIcon>
          </p>{" "}
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
