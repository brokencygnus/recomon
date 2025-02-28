export function HighlightSearch(string, searchTerms, { base = 'font-normal', highlight = 'font-bold' } = {}) {
  if (string === undefined || !searchTerms || searchTerms.length == 0 || (searchTerms.length == 1 && searchTerms[0] == '')) {
    return (
      <span className={base}>{string}</span>
    );
  }

  const searchTermLower = searchTerms.map(s => s.toLowerCase());
  const currentTerm = searchTermLower.shift();

  // Skip if current term is empty
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


// Returns boolean
export const SearchFilter = (string, searchTerms) => {
  return (
    // True if searchTerms is empty
    searchTerms.length == 0
    // True if none of the searchTerms is valid
    || searchTerms.every(term => !term)
    // True if every search term matches (e.g. "camp invest tech" matches "CAMP Investment Technologies")
    || (string !== undefined && searchTerms.every(term => string.toLowerCase().includes(term.toLowerCase())))
  ) 
}