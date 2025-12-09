import styled from "styled-components";

export const AddBtn = styled.button`
  width: 100px;
  height: 40px;
  background-color: var(--main-color) !important;
  border: none;
  border-radius: 5px;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    box-shadow: 0 3px 5px rgb(2, 73, 77);
  }
`;
