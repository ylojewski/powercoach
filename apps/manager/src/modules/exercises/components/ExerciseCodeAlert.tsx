import {
  Alert,
  AlertDescription,
  type AlertProps,
  AlertTitle,
  Badge,
  Skeleton,
  SwitchAnimation
} from '@powercoach/ui'
import { Ban, Check, CircleAlert, Cog, Info, ThumbsUp, TriangleAlert } from 'lucide-react'
import React, { type ReactElement, ReactNode, useEffect, useEffectEvent } from 'react'

import { usePendingGetExerciseCodeQuery } from '@/core'

export interface ExerciseCodeAlertProps {
  code?: null | string
  isTitlePending?: boolean
  onCodeChange: (code: string) => void
  title: string
}

type State = 'duplicate' | 'error' | 'idle' | 'loading' | 'missing' | 'unique'

export function ExerciseCodeAlert({
  code,
  isTitlePending = false,
  onCodeChange,
  title
}: ExerciseCodeAlertProps): ReactElement {
  const trimmedTitle = title.trim()
  const currentCode = code?.trim() || null
  const {
    currentData: data,
    isError,
    isFetching: isQueryFetching
  } = usePendingGetExerciseCodeQuery(
    { title: trimmedTitle },
    {
      refetchOnMountOrArgChange: true,
      skip: !trimmedTitle || Boolean(currentCode) || isTitlePending
    }
  )
  const isLoading = isTitlePending || isQueryFetching
  const generatedCode = data?.code ?? currentCode
  const isUnique = Boolean(!isLoading && ((data && !data.exercise) || currentCode))
  const isDuplicate = Boolean(!isLoading && data && data.exercise)
  const onCodeChangeEvent = useEffectEvent(onCodeChange)

  const state: State = (() => {
    if (isLoading) return 'loading'
    if (!trimmedTitle) return 'missing'
    if (currentCode) return 'unique'
    if (isError) return 'error'
    if (isDuplicate) return 'duplicate'
    if (isUnique) return 'unique'
    return 'idle'
  })()

  const variant: AlertProps['variant'] = (
    {
      duplicate: 'warning',
      error: 'error',
      idle: 'default',
      loading: 'default',
      missing: 'default',
      unique: 'success'
    } satisfies Record<State, AlertProps['variant']>
  )[state]

  const icon: ReactNode = (
    {
      duplicate: <TriangleAlert className="size-4" />,
      error: <CircleAlert className="size-4" />,
      idle: <Info className="size-4" />,
      loading: <Cog className="size-4 animate-spin" />,
      missing: <Info className="size-4" />,
      unique: <ThumbsUp className="size-4" />
    } satisfies Record<State, ReactNode>
  )[state]

  const description: ReactNode = (
    {
      duplicate: (
        <>
          <Badge variant="warning">
            <Ban aria-hidden="true" />
            {generatedCode}
          </Badge>
          <span>already exists</span>
        </>
      ),
      error: <span>Code check service is unavailable. Please try later</span>,
      idle: null,
      loading: (
        <Skeleton>
          <small className="px-1">Computing code</small>
        </Skeleton>
      ),
      missing: <span>Please specify a title so we can compute the code.</span>,
      unique: (
        <>
          <span>Your code is</span>
          <Badge variant="success">
            <Check aria-hidden="true" />
            {generatedCode}
          </Badge>
        </>
      )
    } satisfies Record<State, ReactNode>
  )[state]

  useEffect(() => {
    if (data?.code && !data.exercise) {
      onCodeChangeEvent(data.code)
    }
  }, [data?.code, data?.exercise, onCodeChangeEvent])

  return (
    <Alert
      className="rounded-none px-2.5 transition-[background-color,border-color,color] duration-300 ease-in-out"
      variant={variant}
    >
      <SwitchAnimation
        className="icon place-items-center transition-colors duration-300 ease-in-out"
        motionKey={state}
      >
        {icon}
      </SwitchAnimation>
      <AlertTitle className="w-fit bg-foreground px-2 py-1 font-heading text-xs/none text-background lowercase">
        Exercise code
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-3 text-xs">
        <p>
          Each exercise has a unique code based on its title that serves as its identifier, meaning
          no two exercises can share the same code
        </p>
        <SwitchAnimation
          className="min-h-6 overflow-hidden"
          delay={0.3}
          itemClassName="flex min-w-0 flex-wrap items-center gap-2"
          motionKey={isDuplicate || isUnique ? state + ':' + (generatedCode ?? '') : state}
        >
          {description}
        </SwitchAnimation>
      </AlertDescription>
    </Alert>
  )
}
