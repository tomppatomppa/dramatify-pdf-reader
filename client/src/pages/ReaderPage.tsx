// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  ReaderConfiguration,
  Script,
} from 'src/components/ReaderV3/reader.types'

import { useState } from 'react'

import ReaderInteractive from 'src/components/ReaderV3/ReaderInteractive'
import { reorder } from 'src/NestedListComponent'

const initialState = {
  highlight: [],
  expanded: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
} as ReaderConfiguration

interface ReaderPageProps {
  selected: Script
}

const ReaderPage = ({ selected }: ReaderPageProps) => {
  const scenesConcatLines = selected?.scenes.map((scene, sceneIndex) => {
    return {
      ...scene,
      name: scene.id,
      data: scene.data.map((line, index) => {
        return {
          ...line,
          id: `scene-${sceneIndex}:line-${index}`,
          lines: line.lines.join('\n'),
        }
      }),
    }
  })

  const [scenes, setScenes] = useState(scenesConcatLines)

  const handleDragEnd = (result: any) => {
    const { type, source, destination } = result
    if (!destination) return

    const sourceSceneId = source.droppableId
    const destinationSceneId = destination.droppableId

    if (type === 'droppable-item') {
      if (sourceSceneId === destinationSceneId) {
        const updatedOrder = reorder(
          scenes.find((scene) => scene.id === sourceSceneId).data,
          source.index,
          destination.index
        )
        const updatedCategories = scenes.map((scene) =>
          scene.id !== sourceSceneId ? scene : { ...scene, data: updatedOrder }
        )

        setScenes(updatedCategories)
      }
    }

    // Reordering categories
    if (type === 'droppable-category') {
      const updatedCategories = reorder(scenes, source.index, destination.index)

      setScenes(updatedCategories)
    }
  }

  const AddLine = (sceneIndex: number) => {
    const updatedScenes = [...scenes]

    updatedScenes[sceneIndex].data.push({
      type: '',
      name: '',
      id: `scene-${[sceneIndex]}:line-${scenes[sceneIndex].data.length}`,
      lines: 'new lines\new line\n',
    })

    setScenes(updatedScenes)
  }

  const DeleteLine = (sceneIndex: number, lineIndex: number) => {
    const updatedScenes = [...scenes]
    updatedScenes[sceneIndex].data.splice(lineIndex, 1)

    setScenes(updatedScenes)
  }

  return (
    <div>
      <ReaderInteractive
        data={scenes}
        handleDragEnd={handleDragEnd}
        AddLine={AddLine}
        DeleteLine={DeleteLine}
      />
    </div>
  )
}

export default ReaderPage
