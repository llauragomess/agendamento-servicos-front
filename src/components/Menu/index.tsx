import * as S from "./styles";

const Menu = () => {
  return (
    <S.MenuList>
      <S.ItemList>
        <a href="#about">Sobre</a>
      </S.ItemList>
        <S.ItemList>
        <a href="#slot">Agendamentos</a>
      </S.ItemList>
      <S.ItemList>
        <a href="#customer">Clientes</a>
      </S.ItemList>
      <S.ItemList>
        <a href="#service">Servicos</a>
      </S.ItemList>
      <S.ItemList>
        <a href="#professional">Profissional</a>
      </S.ItemList>
    </S.MenuList>
  );
};

export default Menu;