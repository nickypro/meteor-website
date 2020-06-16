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

// for objects
export function useLocaleObjectState(localItem, defaultValue = {}) {
  //turn string to object
  const savedValue = localStorage.getItem(localItem)
  const [loc, setState] = useState( savedValue ? JSON.parse(savedValue) : defaultValue )

  //turn object to string
  const setLoc = (newItem) => {
    setState(newItem)
    localStorage.setItem(localItem, JSON.stringify(newItem))
  }

  return [loc, setLoc]
}

// for objects
export function useLocaleStateUserMeteorInfo(localItem, defaultValue = {}) {
  //turn string to object
  const savedValues = localStorage.getItem(localItem)
  const [loc, setState] = useState( savedValues ? JSON.parse(savedValues) : defaultValue )

  //turn object to string
  const setLoc = (newItem) => {
    setState(newItem)
    localStorage.setItem(localItem, JSON.stringify(newItem))
  }

  const toggleStar = (id) => {
    const temp      = loc
    const newValue  = temp[id] ? !(temp[id].starred) : true

    temp[id] = {...temp[id], starred: newValue}
    setLoc(temp)
    
    return temp[id]
  }

  const changeLabel = (id, label) => {
    const temp = loc
    
    temp[id] = {...temp[id], label}
    setLoc(temp)

    return temp[id]
  }

  return [loc, setLoc, toggleStar, changeLabel]
}

export default useLocaleSetsState