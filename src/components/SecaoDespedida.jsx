import { useEffect, useState } from 'react'
import Divider from './Divider.jsx'
import Countdown from './Countdown.jsx'
import CartasDiarias, { msDesbloqueio } from './CartasDiarias.jsx'
import { despedida, DATA_RETORNO, TOTAL_CARTAS } from '../data/content.js'

const retornoMs = new Date(DATA_RETORNO).getTime()

// O relógio só pode parar quando não houver mais NADA para acontecer:
// o retorno já chegou E a última carta já abriu.
const fimDoRelogio = Math.max(retornoMs, msDesbloqueio(TOTAL_CARTAS))

export default function SecaoDespedida() {
  // Um único relógio para a seção inteira: o contador e as cartas leem o mesmo
  // `agora`, então a virada do dia destrava a cartinha sem precisar de reload.
  //
  // O useState com função faz o primeiro render já nascer com a hora certa —
  // é isso que evita o contador "piscar" quando a página é aberta depois do retorno.
  const [agora, setAgora] = useState(() => Date.now())
  const acabou = agora >= fimDoRelogio

  useEffect(() => {
    // Nada mais a contar: não chega nem a criar o timer.
    if (acabou) return
    const id = setInterval(() => setAgora(Date.now()), 1000)
    // Limpa no unmount E quando `acabou` vira true (o intervalo para sozinho no zero).
    return () => clearInterval(id)
  }, [acabou])

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Divider />

      <h3 className="text-gradient font-serif text-3xl font-bold sm:text-4xl">
        {despedida.titulo}
      </h3>

      <Countdown agora={agora} />

      <CartasDiarias agora={agora} />
    </div>
  )
}
