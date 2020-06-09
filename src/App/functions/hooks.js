import {useState} from 'react'

//for sets
export function useLocaleSetsState(localItem) {
  //turn string to object to set
  const savedValue = localStorage.getItem(localItem)
  const [loc, setState] = useState( savedValue ? new Set( JSON.parse(savedValue) ) : new Set() )

  //save object as string
  const setLoc = (newItem) => {
    setState(newItem)
    localStorage.setItem(localItem, JSON.stringify([...newItem]))
  }

  if (!loc) setLoc(new Set())

  return [loc, setLoc]
}

export default useLocaleSetsState