import { useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { NextButton, PrevButton, usePrevNextButtons } from './CarouselControl'
import type { Carousel as CarouselType } from '@/types/carousel'
// import { navigate } from 'astro:transitions/client'
// import { ImageOverlay } from './image-overlay'

export const Carousel = (props: {
  children: any
  delay?: number
  playOnInit?: boolean
  items: (
    | {
        title: string
        description: string
        href: string
      }
    | any
  )[]
}) => {
  //   const [isOpen, setIsOpen] = useState(false)
  //   const [selectedItem, setselectedItem] = useState<number>(0)

  const { children, playOnInit, delay, items } = props

  const childrens = children.props.value
    .split(`<div class="carousel__slide__number`)
    .filter((d: string) => d != ' ' && d !== '')

  const [emblaRef, emblaApi] = useEmblaCarousel({ active: true, loop: true }, [
    Autoplay({
      playOnInit: playOnInit === undefined ? true : playOnInit,
      delay: delay === undefined ? 5000 : delay,
    }),
  ])

  const {
    prevBtnDisabled,
    onPrevButtonClick,
    nextBtnDisabled,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoplay = emblaApi?.plugins()?.autoplay
      if (!autoplay) return

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop

      resetOrStop()
      callback()
    },
    [emblaApi],
  )

  const toggleAutoplay = useCallback(
    (play: boolean) => {
      const autoplay = emblaApi?.plugins()?.autoplay
      if (!autoplay) return

      const playOrStop = play ? autoplay.play : autoplay.stop
      playOrStop()
    },
    [emblaApi],
  )

  return (
    <>
      <div className="carousel relative">
        <div className="carousel__viewport" ref={emblaRef}>
          <div
            className="carousel__container"
            onMouseOver={() => toggleAutoplay(false)}
            onMouseLeave={() => toggleAutoplay(true)}
          >
            {(childrens as string[]).map((child, idx) => (
              <div
                key={idx}
                className="carousel__slide"
                dangerouslySetInnerHTML={{
                  __html: `<div class="carousel__slide__number${child}`,
                }}
                onClick={() => {
                  //   setIsOpen(true)
                  //   setselectedItem(idx)
                //   navigate(items[idx].href)
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-0 -translate-y-1/2 transform px-1 md:px-6">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 transform px-1 md:px-6">
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
      {/* <ImageOverlay
        isOpen={isOpen}
        onCLose={() => setIsOpen(false)}
        imgSource={
          `<img src=` +
          (childrens[selectedItem] as string).split('<img src=')[1]
        }
      >
        <>
          <h4
            className="mb-2 text-center text-xl md:mb-6 md:text-3xl"
            style={{ color: '#1e3b6f' }}
          >
            {items[selectedItem].title}
          </h4>
          <p className="w-full text-xs font-normal text-slate-700 md:mb-4 md:text-base">
            {items[selectedItem].desc}
          </p>
        </>
      </ImageOverlay> */}
    </>
  )
}
