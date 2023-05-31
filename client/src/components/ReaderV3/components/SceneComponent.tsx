import { useState } from 'react'
import { useReaderContext } from '../contexts/ReaderContext'
import { Scene } from '../reader.types'
import EditIcon from './icons/EditIcon'
import ReaderMenuButton from './ReaderMenuButton'
import styles from '../Reader.module.css'
import clsx from 'clsx'
import EditableSceneItem from './EditableSceneItem'
import { LineComponent } from './LineComponent'
import StaticSceneItem from './StaticSceneItem'

interface SceneProps {
  scene: Scene
  index: number
  onSave: (index: number, scene: Scene) => void
}

export const SceneComponent = ({ scene, index, onSave }: SceneProps) => {
  const { options, dispatch } = useReaderContext()
  const isExpanded = options.expanded.includes(scene.id)
  const [isEditing, setIsEditing] = useState(false)

  const handleExpandScene = (sceneId: string) => {
    if (!sceneId) return
    dispatch({
      type: 'SET_EXPAND',
      payload: {
        sceneId,
      },
    })
  }

  const handleHighlight = (name: string) => {
    dispatch({ type: 'HIGHLIGHT_TARGET', payload: { target: name } })
  }

  const handleSetEditing = () => {
    setIsEditing(true)
  }
  const handleSave = (scene: Scene) => {
    console.log(scene)
    // onSave(index, modifiedScene as any)
    // setIsEditing(false)
  }

  return (
    <section className={clsx(styles.scene, styles[!isEditing ? '' : 'edit'])}>
      <div className="flex items-center justify-center">
        <h1
          onClick={() => handleExpandScene(scene.id)}
          className=" hover:bg-blue-200 flex-1  cursor-pointer font-bold w-1/2"
        >
          {scene.id}
        </h1>
        <ReaderMenuButton
          show={isExpanded && !isEditing}
          icon={<EditIcon />}
          onClick={() => setIsEditing(true)}
        />
      </div>
      {isExpanded &&
        (isEditing ? (
          <EditableSceneItem
            scene={scene}
            isEditing={isEditing}
            handleHighlight={handleHighlight}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            options={options}
          />
        ) : (
          <StaticSceneItem
            scene={scene}
            handleHighlight={handleHighlight}
            options={options}
          />
        ))}
    </section>
  )
}
