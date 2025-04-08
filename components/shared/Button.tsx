import React, { ButtonHTMLAttributes, FC } from "react";
import { ButtonProps, Button as MantineButton } from "@mantine/core";

const Button: FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ ...props }) => {
  return <MantineButton color="#5c0087" {...props} />;
};

export default Button;
