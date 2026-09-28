// Defeso eleitoral de 2026 (Lei 9.504/1997, art. 73, VI, "b"; Ofício Circular
// GR 01/2026 da Reitoria da Unicamp): de 04/07 até o 2º turno, em 25/10, marcas
// e nomes de governos, prefeituras e secretarias saem das áreas de parceiros.
// A restauração está autorizada a partir de 26/10/2026 (DEFESO_ELEITORAL_2026.md).
//
// A data fica no código, e não só no cadastro, porque o cadastro falhou: os
// dois órgãos públicos continuaram ativos no banco e apareciam em
// /sobre/parceiros durante o defeso.
export const INICIO_DO_DEFESO = new Date('2026-07-04T00:00:00-03:00');
export const FIM_DO_DEFESO = new Date('2026-10-26T00:00:00-03:00');

export const emDefesoEleitoral = (agora = new Date()) => agora >= INICIO_DO_DEFESO && agora < FIM_DO_DEFESO;
