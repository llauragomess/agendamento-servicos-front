import * as S from "./styles";

import logo from "../../assets/logo.png";
import Menu from "../Menu";
import { Image } from "primereact/image";

const Header = () => {
  return (
    <S.Box>
      <Image
        src={logo}
        width="180"
        style={{ margin: 10 }}
      />
      <Menu />
    </S.Box>
  );
};

export default Header;