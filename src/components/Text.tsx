"use client"

import { useStore } from '@/zustand/store'
import React from 'react'

type Props = {
    content: string,
    tw: string
}

export default function Text({content, tw}: Props) {
    const {themeStore} = useStore(state=>state) 
  return (
    <p className={tw} style={{color: themeStore.text_color}}>{content}</p>
  )
}