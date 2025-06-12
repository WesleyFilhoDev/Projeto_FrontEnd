// app/vagas/editar/[id]/page.js

// 1. Importa o componente que está na sua pasta 'components'
import EditVacancy from "../../../components/editVacancy";
// (Ajuste a quantidade de '../' para corresponder ao caminho correto)

// 2. A página em si, que simplesmente retorna o seu componente
export default function PaginaDeEdicao() {
  return <EditVacancy />;
}
