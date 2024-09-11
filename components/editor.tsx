import React from 'react'
import { Design } from '@/types'

interface EditorProps {
    design: Design[]
}

const Editor:React.FC<EditorProps> = ({ design }) => {
  return (
    <div>{design[0].name}</div>
  )
}

export default Editor