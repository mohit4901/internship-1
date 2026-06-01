import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MoveRight, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(
    () => ["innovative", "ambitious", "brilliant", "competitive", "future-ready"],
    []
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">

          {/* Top badge */}
          <div>
            <Button variant="secondary" size="sm" className="gap-2 rounded-full font-medium">
              Registrations Open 2026 <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Headline with cycling words */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular text-slate-900">
              <span>India's most</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-brand-orange"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span>AI Olympiad</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-500 max-w-2xl text-center">
              Bharat AI Olympiad empowers school &amp; college students to benchmark their
              AI and logical thinking skills at a national level — with rigorous offline proctoring.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-row gap-3">
            <Link to="/student/login">
              <Button size="lg" className="gap-2 rounded-full" variant="outline">
                Explore Syllabus <PhoneCall className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/student/login">
              <Button size="lg" className="gap-2 rounded-full">
                Register Now <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export { Hero }
