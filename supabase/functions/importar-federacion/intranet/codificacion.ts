/**
 * La intranet (Novanet) sirve el HTML en ISO-8859-1, no en UTF-8: si se lee con `text()`,
 * las tildes y las eñes se pierden («�lvaro», «�ltimos»). Se decodifica con la codificación
 * que declare la respuesta y, si no declara ninguna, con windows-1252 (superconjunto de
 * ISO-8859-1 que entienden todos los navegadores).
 */
export function codificacionDe(contentType: string | null): string {
  const coincidencia = /charset=["']?([\w-]+)/i.exec(contentType ?? '');
  const declarada = coincidencia?.[1]?.toLowerCase();
  if (!declarada) {
    return 'windows-1252';
  }
  return declarada === 'iso-8859-1' || declarada === 'latin1' ? 'windows-1252' : declarada;
}

/** Bytes de la respuesta → texto, respetando la codificación. */
export function decodificar(bytes: ArrayBuffer, contentType: string | null): string {
  return new TextDecoder(codificacionDe(contentType)).decode(bytes);
}
