
import BlusaRosa from "@/assets/loja/blusa-rosa.svg";
import CalcaCoracao from "@/assets/loja/calca-coracao.svg";
import CalcaPreta from "@/assets/loja/calca-preta.svg";
import CalcaWideleg from "@/assets/loja/calca-wideleg.svg";
import CamisetaCoracao from "@/assets/loja/camiseta-coracao.svg";
import Chinelo from "@/assets/loja/chinelo.svg";
import CroppedBorboleta from "@/assets/loja/cropped-borboleta.svg";
import CroppedCoracao from "@/assets/loja/cropped-coracao.svg";
import CroppedEstrela from "@/assets/loja/cropped-estrela.svg";
import CroppedPreto from "@/assets/loja/cropped-preto.svg";
import JeansMom from "@/assets/loja/jeans-mom.svg";
import Puffer from "@/assets/loja/puffer.svg";
import Regata from "@/assets/loja/regata.svg";
import SaiaBranca from "@/assets/loja/saia-branca.svg";
import SaiaJeans from "@/assets/loja/saia-jeans.svg";
import SaiaPreta from "@/assets/loja/saia-preta.svg";
import SaltoPreto from "@/assets/loja/salto-preto.svg";
import Sapatilha from "@/assets/loja/sapatilha.svg";
import ShortJeans from "@/assets/loja/short-jeans.svg";
import TenisAdidasBranco from "@/assets/loja/tenis-adidas-branco.svg";
import TenisAllStar from "@/assets/loja/tenis-all-star.svg";
import TenisNikePreto from "@/assets/loja/tenis-nike-preto.svg";
import TenisSalmao from "@/assets/loja/tenis-salmao.svg";
import TenisVerde from "@/assets/loja/tenis-verde.svg";
import Tennis from "@/assets/loja/tennis.svg";

const dados = {
  "blusa-rosa.svg": BlusaRosa,
  "calca-coracao.svg": CalcaCoracao,
  "calca-preta.svg": CalcaPreta,
  "calca-wideleg.svg": CalcaWideleg,
  "camiseta-coracao.svg": CamisetaCoracao,
  "chinelo.svg": Chinelo,
  "cropped-borboleta.svg": CroppedBorboleta,
  "cropped-coracao.svg": CroppedCoracao,
  "cropped-estrela.svg": CroppedEstrela,
  "cropped-preto.svg": CroppedPreto,
  "jeans-mom.svg": JeansMom,
  "puffer.svg": Puffer,
  "regata.svg": Regata,
  "saia-branca.svg": SaiaBranca,
  "saia-jeans.svg": SaiaJeans,
  "saia-preta.svg": SaiaPreta,
  "salto-preto.svg": SaltoPreto,
  "sapatilha.svg": Sapatilha,
  "short-jeans.svg": ShortJeans,
  "tenis-adidas-branco.svg": TenisAdidasBranco,
  "tenis-all-star.svg": TenisAllStar,
  "tenis-nike-preto.svg": TenisNikePreto,
  "tenis-salmao.svg": TenisSalmao,
  "tenis-verde.svg": TenisVerde,
  "tennis.svg": Tennis
};

export const imagensPorNome = {
  "Camiseta regata": Regata,
  "Cropped preto": CroppedPreto,
  "Cropped lolá": BlusaRosa,
  "Camiseta coração": CamisetaCoracao,
  "Calça mom": JeansMom,
  "Saia": SaiaPreta,
  "Calça preta": CalcaPreta,
  "Shorts jeans": ShortJeans,
  "Tênis azul": Tennis,
  "Chinelo": Chinelo,
  "Sapatilha": Sapatilha,
  "Tênis salmão": TenisSalmao,
  "Tênis verde": TenisVerde,
  "Cropped coração": CroppedCoracao,
  "Cropped estrela": CroppedEstrela,
  "Cropped borboleta": CroppedBorboleta,
  "Puffer": Puffer,
  "Calça wide leg": CalcaWideleg,
  "Saia jeans": SaiaJeans,
  "Saia branca": SaiaBranca,
  "Calça coração": CalcaCoracao,
  "Tênis All Star": TenisAllStar,
  "Salto preto": SaltoPreto,
  "Tênis Adidas branco": TenisAdidasBranco,
  "Tênis Nike preto": TenisNikePreto
};

export const categorias = [
  { id: "camiseta", nome: "Camisetas" },
  { id: "calca", nome: "Calças/Saias" },
  { id: "calcado", nome: "Calçados" }
];

export const obterImagemItem = (item) => {
  if (!item) return null;

  const arquivo = item.imagem_url?.split("/").pop();

  return dados[arquivo] || imagensPorNome[item.nome] || null;
};

export default dados;
