export function HighlightSearch(string, searchTerms, { base = 'font-normal', highlight = 'font-bold' } = {}) {
  if (!searchTerms || searchTerms.length == 0 || (searchTerms.length == 1 && searchTerms[0] == '')) {
    return (
      <span className={base}>{string}</span>
    );
  }

  const searchTermLower = searchTerms.map(s => s.toLowerCase());
  const currentTerm = searchTermLower.shift();

  // Skip if current term is empy
  if (currentTerm == '') {
    return HighlightSearch(string, searchTermLower, { base, highlight })
  }

  const stringLower = string.toLowerCase();
  const stringLowerArray = stringLower.split(currentTerm);

  let resultStringArray = [];
  let resultTermArray = [];

  stringLowerArray.forEach(e => {
    let currentResult = string.substring(0, e.length);
    resultStringArray.push(currentResult);
    string = string.substring(e.length);

    currentResult = string.substring(0, currentTerm.length);
    resultTermArray.push(currentResult);
    string = string.substring(currentTerm.length);
  });

  const firstE = resultStringArray.shift();

  return (
    <>
      {HighlightSearch(firstE, searchTermLower, { base, highlight })}
      {resultStringArray.map((s, i) => {
        return (
          <>
            {resultTermArray[i] ?
              <span className={highlight}>{resultTermArray[i]}</span>
              : null}
            {HighlightSearch(s, searchTermLower, { base, highlight })}
          </>
        );
      })}
    </>
  );
}


export const SearchFilter = (string, searchTerms) => {
  return (
    searchTerms.length == 0
    || searchTerms.every(term => !term)
    || searchTerms.every(term => string.toLowerCase().includes(term.toLowerCase()))
  ) 
}