// ===============================================
// for dangerouslySetInnerHTML
export const createMarkup = htmlString => ({ __html: htmlString });

export const isEmpty = (obj) => {
  if (obj === null) return true
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export const searchByIdOf = (objArray, idToSearch) => { 
  if (!Array.isArray(objArray)) { return null }
  const id = Number(idToSearch)
  const res = objArray.filter(obj => obj.id === id )
  return res.length > 0 ? res[0] : null
}
