import { Card, SvgIcon } from "@mui/material";
import "./styles.css";
import { CardProps } from "../../typings";
import { useMutation } from "@apollo/client";
import { ADD_COMPANY, ADD_TALENT } from "../../graphql/graphql";
import Swal from "sweetalert2";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

export function CardComponent(props: CardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [addTalent] = useMutation(ADD_TALENT, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
  });

  const [addCompany] = useMutation(ADD_COMPANY, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      if (props.onCheck) {
        props.onCheck(props?.id); // Call onCheck if it's defined
      }
    } else {
      if (props.onUncheck) {
        props.onUncheck(props?.id); // Call onUncheck if it's defined
      }
    }
  };

  const handleAdd = async () => {
    try {
      const { data } =
        localStorage.getItem("role") === "company"
          ? await addTalent({
              variables: {
                talentId: props.id,
              },
            })
          : await addCompany({
              variables: {
                companyId: props.id,
              },
            });
      if (data) {
        Swal.fire({
          icon: "success",
          text: "Item added",
        });
        if (props.refetchProfile) {
          props.refetchProfile();
        }
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        text: "Error " + error,
      });
    }
  };

  return (
    <Card
      variant="outlined"
      className="card"
      sx={{
        backgroundColor: "whitesmoke",
        borderRadius: "0.5rem",
      }}
    >
      <section className="top-items">
        <img src="https://placehold.co/50" />

        {props.canAdd && (
          <SvgIcon
            onClick={() => {
              handleAdd();
            }}
            sx={{
              cursor: "pointer",
            }}
            {...props}
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          </SvgIcon>
        )}
      </section>
      <p>
        Name:<b>{props.name}</b>
      </p>
      <p>
        Email: <b>{props.email}</b>
      </p>
      {props.canDelete && (
        <section className="checkbox">
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
        </section>
      )}
    </Card>
  );
}
