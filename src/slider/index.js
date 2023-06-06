import cn from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import s from './slider.module.scss'

const Slides = forwardRef(({ children, className }, ref) => (
  <div className={cn(s.slider, className)} ref={ref}>
    <div className={s.container}>{[children].flat().map((child) => child)}</div>
  </div>
))
Slides.displayName = 'Slides'

function Slider({ children, emblaApi = { autoplay: false }, enabled = true }) {
  // eslint-disable-next-line no-unused-vars
  const [_, setScrollSnaps] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const autoplay = Autoplay({ delay: emblaApi?.autoplay?.delay || null }, (emblaRoot) => emblaRoot.parentElement)
  const [emblaRef, embla] = useEmblaCarousel(emblaApi, emblaApi.autoplay ? [autoplay] : [])

  const scrollPrev = useCallback(() => {
    embla && embla.scrollPrev()
  }, [embla])

  const scrollNext = useCallback(() => {
    embla && embla.scrollNext()
  }, [embla])

  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [embla])

  const getScrollProgress = useCallback(() => {
    embla && setScrollProgress(Math.max(0, Math.min(1, embla.scrollProgress())))
  }, [embla])

  const getScrollSnap = useCallback(() => {
    setCurrentIndex(embla.selectedScrollSnap())
    setScrollSnaps(embla.scrollSnapList())
  }, [embla])

  useEffect(() => {
    if (embla) {
      getScrollSnap()
      getScrollProgress()
      embla.on('select', getScrollSnap)
      embla.on('scroll', getScrollProgress)
      embla.on('reInit', getScrollProgress)
    }
  }, [embla])

  useEffect(() => {
    if (!enabled && embla) {
      embla.destroy()
    }
  }, [embla, enabled])

  return children
    ? children({
        emblaRef,
        currentIndex,
        setCurrentIndex,
        scrollPrev,
        scrollNext,
        scrollTo,
        scrollProgress,
      })
    : null
}

Slider.Slides = Slides

export { Slider }
