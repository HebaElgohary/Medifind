import styled from "styled-components";
import { motion } from "framer-motion";

export const StyledButton = styled(motion.button)`
   padding: 12px 20px;
  font-family: "sofia-pro", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: #fff;
  border: none;
  background-color:#01B3BD;
  cursor: pointer;
  border-radius: 8px;
  width: 160px;
  transition: transform 0.2s;
  height: auto;

  &:hover {
    transform: scale(1.05);
    background-color: #42ced5;
  }

  &:active {
    transform: scale(0.95);
  }
`;
export const Styledbtn = ({ onClick, children }) => {
  return (
    <StyledButton onClick={onClick} whileTap={{ scale: 0.95 }}>
      {children}
    </StyledButton>
  );
};