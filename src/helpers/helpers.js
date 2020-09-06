/**
 * Transforma uma string em um array de palavras
 * @param {String} str - string a ser tokenizada
 * @returns {Array} array da string tokenizada
 */
exports.tokenization = (str) => {
  str = str.split(' ')

  return str.map((elm) => {
    /**
     * Elima os 3 últimos caracteres das palavras que possuem mais de 3.
     * a fim de desconsiderar o tempo verbal das palavras
     */
    if (elm.length > 3) return elm.substr(0, elm.length - 3)
    else return elm
  })
}

/**
 * Normaliza uma string removendo a acentuação e transformando em caixa baixa
 * @param {String} str - string a ser normalizada
 */
exports.strNormalize = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}
