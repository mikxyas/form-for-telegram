import { useStore } from '@/zustand/store'
import React from 'react'

type Props = {
    title: string,
    action: () => void,
    tw?: any,
    center: boolean,
    primary?: boolean
}

export default function Button({ title, action, tw, center, primary }: Props) {
    const {themeStore} = useStore(state=>state)
    return (
        <div>
            {primary ?
                <button onClick={() => action()} style={{ background: themeStore.button_color, }} className={`px-3 ${tw} py-1.5  self-center  `}>
                    <p style={{ color: themeStore.button_text_color, fontSize: '18px', textAlign: center ? 'center' : 'right' }} className="text-center">{title}</p>
                </button>
                : <button onClick={() => action()} style={{ background: themeStore.button_color }} className={`px-3 ${tw} py-1.5 opacity-70 self-center   `}>
                    <p style={{ color: themeStore.button_text_color, fontSize: '18px', textAlign: center ? 'center' : 'right' }} className="">{title}</p>
                </button>
            }

        </div>

    )
}