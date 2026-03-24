import { useState } from 'react'
import { IconEye, IconEyeSlash } from './UiIcons'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

/** Şifre alanı + sağda “göster / gizle” (erişilebilir düğme). */
export function PasswordInput({ className = '', ...rest }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-11`.trim()}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-diapal-500 focus-visible:ring-offset-0"
        aria-pressed={visible}
        aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <IconEyeSlash className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
      </button>
    </div>
  )
}
