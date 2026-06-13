import { Exercise } from '@/core'

export function createBlankExercise(): Exercise {
  return {
    archivedAt: null,
    bodyweightCoefficient: null,
    code: '',
    createdAt: '',
    descriptionMarkdown: null,
    id: 0,
    imageUrl: null,
    isSystem: false,
    isUnilateral: false,
    loadingTypeId: null,
    patternId: null,
    publicationStatus: 'draft',
    shortInstructionsMarkdown: null,
    subtitle: null,
    title: '',
    updatedAt: '',
    videoUrl: null
  }
}
