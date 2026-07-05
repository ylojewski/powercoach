import { cva } from 'class-variance-authority'

export const tabsIndicatorVariants = cva(`pointer-events-none absolute -z-10 bg-foreground`, {
  variants: {
    orientation: {
      // prettier-ignore
      horizontal: `
        -top-3 h-3
        [left:calc(var(--active-tab-left)-var(--tabs-active-leading-border-offset))]
        [width:calc(var(--active-tab-width)+var(--tabs-active-leading-border-offset))]
        rtl:[left:var(--active-tab-left)]
        [transition-property:left,width] [transition-duration:300ms]
        [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
        motion-safe:[transition-property:left,width,translate]
        motion-safe:[transition-duration:300ms,300ms,200ms]
        motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1)]
        motion-safe:data-starting-style:[translate:0_100%]
        motion-safe:data-ending-style:[translate:0_100%]
      `,
      // prettier-ignore
      vertical: `
        -left-3 w-3
        [top:calc(var(--active-tab-top)-var(--tabs-active-leading-border-offset))]
        [height:calc(var(--active-tab-height)+var(--tabs-active-leading-border-offset))]
        [transition-property:top,height] [transition-duration:300ms]
        [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
        motion-safe:[transition-property:top,height,translate]
        motion-safe:[transition-duration:300ms,300ms,200ms]
        motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1)]
        motion-safe:data-starting-style:[translate:100%_0]
        motion-safe:data-ending-style:[translate:100%_0]
      `
    }
  }
})
