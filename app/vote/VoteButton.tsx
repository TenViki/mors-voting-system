import Button from "&/shared/Button";
import { ButtonProps } from "@mantine/core";
import { FC, HtmlHTMLAttributes } from "react";

const VoteButton: FC<ButtonProps & HtmlHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return <Button {...props}>{children}</Button>;
};

export default VoteButton;
