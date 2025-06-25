import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useState } from "react";
import { useEffect } from "react";
import Meal from "./Meal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const handleData = async () => {
      const response = await fetch(
        "http://localhost:8000/api/meals"
      );

      const res = await response.json();
      setMeals(res);
    };

    handleData();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {meals.map((meal, index) => {
          return (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <Item>
                <Meal
                  key={meal.title}
                  title={meal.title}
                  description={meal.description}
                  price={meal.price}
                />
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
