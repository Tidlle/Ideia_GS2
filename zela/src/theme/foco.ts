import { ViewStyle } from 'react-native';

import { cores } from './cores';

/** Anel de foco para quem navega pelo teclado (web) ou por leitor de tela com foco visível. */
export const anelFoco: ViewStyle = {
  outlineWidth: 2,
  outlineStyle: 'solid',
  outlineColor: cores.link,
  outlineOffset: 2,
};

/**
 * Use no `style` de um Pressable: `style={(e) => [..., comFoco(e)]}`.
 * No react-native-web o estado também traz `focused`; no celular ele não existe e nada muda.
 */
export const comFoco = (estado: { pressed: boolean }) =>
  (estado as { pressed: boolean; focused?: boolean }).focused ? anelFoco : null;
