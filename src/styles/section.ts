// Section.tsx
import styled from "styled-components";

export const Section = styled.section<{ $bg: string }>`
  background-color: ${({ $bg }) => $bg};
 
  padding: 60px 20px;
`;

export const ContentBox = styled.div`
  background-color: #f8fdff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  margin: 2rem auto;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-height: 75vh; /* ?? altura mínima garantida */

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;
